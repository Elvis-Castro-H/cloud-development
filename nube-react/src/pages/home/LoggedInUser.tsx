import { useState, useEffect } from "react";
import Button from "../../components/Button";
import { Input } from "../../components/Input";
import { useFirebaseUser } from "../../hooks/useFirebaseUser";
import { usePostRepository } from "../../hooks/usePostRepository";
import { useNotifications } from "../../hooks/useNotifications";
import { db } from "../../firebase/FirebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default function LoggedInUser() {
  const { user } = useFirebaseUser();
  const { posts, createPost, deletePost, likePost, dislikePost } = usePostRepository();
  const { notifications, markAsRead } = useNotifications();
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [likesData, setLikesData] = useState<Record<string, { likes: number; dislikes: number; userReaction?: string }>>({});

  const handleCreate = async () => {
    if (!content.trim()) return;
    await createPost(content, imageFile || undefined);
    setContent("");
    setImageFile(null);
  };

  const fetchLikesData = async () => {
    const allLikes = await getDocs(collection(db, "postLikes"));
    const data: Record<string, { likes: number; dislikes: number; userReaction?: string }> = {};

    allLikes.forEach((doc) => {
      const { postId, type, userId } = doc.data();
      if (!data[postId]) {
        data[postId] = { likes: 0, dislikes: 0 };
      }
      if (type === "like") data[postId].likes += 1;
      if (type === "dislike") data[postId].dislikes += 1;
      if (user?.uid === userId) data[postId].userReaction = type;
    });

    setLikesData(data);
  };

  useEffect(() => {
    fetchLikesData();
  }, [posts]);

  const handleLike = async (postId: string, ownerId: string) => {
    await likePost(postId, ownerId);
    await fetchLikesData();
  };

  const handleDislike = async (postId: string, ownerId: string) => {
    await dislikePost(postId, ownerId);
    await fetchLikesData();
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">🔔 Notificaciones</h2>
        {notifications.length === 0 && <p className="text-sm text-gray-500">No hay notificaciones</p>}
        {notifications.map((n) => (
          <div key={n.id} className={`p-2 mb-2 border rounded ${n.read ? "bg-gray-100" : "bg-yellow-100"}`}>
            <div className="flex justify-between items-center">
              <p className="text-sm">{n.message}</p>
              {!n.read && (
                <button
                  className="text-xs text-blue-600 underline"
                  onClick={() => markAsRead(n.id)}
                >
                  Marcar como leída
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-2">
        <Input
          placeholder="¿Qué estás pensando?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow"
        >
          📸 Subir imagen
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setImageFile(e.target.files[0]);
            }
          }}
          className="hidden"
        />
        {imageFile && (
          <p className="text-xs text-indigo-700 font-medium">
            Imagen seleccionada: {imageFile.name}
          </p>
        )}
        <Button onClick={handleCreate}>Postear</Button>
      </div>

      {posts.map((post) => {
        const likeInfo = likesData[post.id] || { likes: 0, dislikes: 0 };
        const userReaction = likeInfo.userReaction;

        return (
          <div key={post.id} className="border p-3 mb-3 rounded shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              {post.photoURL && (
                <img
                  src={post.photoURL}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="font-bold">{post.displayName}</span>
              <span className="text-xs text-gray-500 ml-auto">
                {post.createdAt?.toDate?.().toLocaleString?.() ?? "Sin hora"}
              </span>
            </div>
            <p className="text-sm">{post.content}</p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Imagen del post"
                className="mt-2 rounded max-h-80 w-auto object-contain"
              />
            )}
            <div className="mt-2 flex items-center gap-4">
              <button
                onClick={() => handleLike(post.id, post.uid)}
                className={`flex items-center gap-1 text-sm ${userReaction === "like" ? "text-blue-600 font-semibold" : ""}`}
              >
                👍 {likeInfo.likes}
              </button>
              <button
                onClick={() => handleDislike(post.id, post.uid)}
                className={`flex items-center gap-1 text-sm ${userReaction === "dislike" ? "text-red-600 font-semibold" : ""}`}
              >
                👎 {likeInfo.dislikes}
              </button>
            </div>
            {user?.uid === post.uid && (
              <Button onClick={() => deletePost(post.id)} className="mt-2 bg-red-500">
                Eliminar
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
