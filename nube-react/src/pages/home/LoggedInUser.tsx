import { useState } from "react";
import Button from "../../components/Button";
import { Input } from "../../components/Input";
import { useFirebaseUser } from "../../hooks/useFirebaseUser";
import { usePostRepository } from "../../hooks/usePostRepository";
import { useNotifications } from "../../hooks/useNotifications";

export default function LoggedInUser() {
  const { user } = useFirebaseUser();
  const { posts, createPost, deletePost } = usePostRepository();
  const { notifications, markAsRead } = useNotifications();
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleCreate = async () => {
    if (!content.trim()) return;
    await createPost(content, imageFile || undefined);
    setContent("");
    setImageFile(null);
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

      {posts.map((post) => (
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
          {user?.uid === post.uid && (
            <Button onClick={() => deletePost(post.id)} className="mt-2 bg-red-500">
              Eliminar
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
