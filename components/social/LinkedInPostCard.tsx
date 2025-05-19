import { MoreHorizontal } from "lucide-react";

export function LinkedInPostCard({ post, user }: { post: any, user: any }) {
  return (
    <div className="rounded-lg border bg-white shadow p-4 max-w-xl mx-auto my-4">
      <div className="flex items-center gap-3 mb-2">
        <img src={user?.avatar_url || "/default-avatar.png"} className="w-10 h-10 rounded-full" />
        <div>
          <div className="font-bold">{user?.full_name || "User"}</div>
          <div className="text-gray-500 text-xs">{user?.headline || "Professional headline"}</div>
        </div>
        <div className="ml-auto"><MoreHorizontal /></div>
      </div>
      <div className="text-base mb-2 whitespace-pre-line">{post.caption}</div>
      {post.image_url && (
        <img src={post.image_url} alt="LinkedIn post image" className="rounded-lg border mb-2" />
      )}
      <div className="flex gap-6 text-gray-500 text-xs mt-2">
        <span>👍 Like</span>
        <span>💬 Comment</span>
        <span>🔗 Share</span>
        <span>✉️ Send</span>
      </div>
    </div>
  );
} 