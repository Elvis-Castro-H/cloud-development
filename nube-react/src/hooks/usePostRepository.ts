import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import { useFirebaseUser } from "./useFirebaseUser";
import axios from "axios";

interface Post {
  id: string;
  uid: string;
  displayName: string;
  photoURL?: string;
  content: string;
  imageUrl?: string;
  createdAt?: any;
}

const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "post_images"); 
  formData.append("cloud_name", "dnf9b6wun");   

  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dnf9b6wun/image/upload",
    formData
  );

  return res.data.secure_url;
};

export const usePostRepository = () => {
  const { user } = useFirebaseUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const postsCollection = collection(db, "posts");
  const notificationsCollection = collection(db, "notifications");
  const usersCollection = collection(db, "users"); 

  const loadPosts = async () => {
    setLoading(true);
    const q = query(postsCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const fetchedPosts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[];
    setPosts(fetchedPosts);
    setLoading(false);
  };

  const createPost = async (content: string, imageFile?: File) => {
    if (!user) return;

    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadImageToCloudinary(imageFile);
    }

    await addDoc(postsCollection, {
      uid: user.uid,
      displayName: user.displayName || "Usuario sin nombre",
      photoURL: user.photoURL || null,
      content,
      imageUrl,
      createdAt: serverTimestamp(),
    });

    try {
      const allUsers = await getDocs(usersCollection);
      const message = `${user.displayName || "Alguien"} publicó un nuevo post`;

      if (allUsers.docs.length === 0) {
        console.warn("⚠️ No se encontraron usuarios en la colección.");
      }

      for (const docSnap of allUsers.docs) {
        const targetId = docSnap.id;

        if (targetId !== user.uid) {
          const notificationPayload = {
            userId: targetId,
            message,
            timestamp: serverTimestamp(),
            read: false,
          };

          await addDoc(notificationsCollection, notificationPayload);
        } else {
          console.log("Saltando notificación para sí mismo:", targetId);
        }
      }
    } catch (error) {
      console.error("ERROR GLOBAL AL CREAR NOTIFICACIONES:", error);
    }


    await loadPosts();
  };

  const deletePost = async (postId: string) => {
    await deleteDoc(doc(db, "posts", postId));
    await loadPosts();
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return {
    posts,
    loading,
    createPost,
    deletePost,
    reloadPosts: loadPosts,
  };
};
