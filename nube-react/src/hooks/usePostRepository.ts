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

interface Post {
  id: string;
  uid: string;
  displayName: string;
  photoURL?: string;
  content: string;
  createdAt?: any;
}

export const usePostRepository = () => {
  const { user } = useFirebaseUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const postsCollection = collection(db, "posts");

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

  const createPost = async (content: string) => {
    if (!user) return;
    await addDoc(postsCollection, {
      uid: user.uid,
      displayName: user.displayName || "Usuario sin nombre",
      photoURL: user.photoURL || null,
      content,
      createdAt: serverTimestamp(),
    });
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