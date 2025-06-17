import { useState } from "react";
import Button from "../../components/Button";
import { Input } from "../../components/Input";
import { useFirebaseUser } from "../../hooks/useFirebaseUser";
import { usePostRepository } from "../../hooks/usePostRepository";

export default function LoggedInUser() {
  const { user } = useFirebaseUser();
  const { posts, createPost, deletePost } = usePostRepository();
  const [content, setContent] = useState("");

  const handleCreate = async () => {
    if (!content.trim()) return;
    await createPost(content);
    setContent("");
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
        <Input
          placeholder="¿Qué estás pensando?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button onClick={handleCreate}>Postear</Button>
      </div>

      {posts.map((post) => (
        <div key={post.id} className="border p-3 mb-3 rounded shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            {post.photoURL && (
              <img src={post.photoURL} alt="Avatar" className="w-8 h-8 rounded-full" />
            )}
            <span className="font-bold">{post.displayName}</span>
            <span className="text-xs text-gray-500 ml-auto">
              {post.createdAt?.toDate?.().toLocaleString?.() ?? "Sin hora"}
            </span>
          </div>
          <p className="text-sm">{post.content}</p>
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