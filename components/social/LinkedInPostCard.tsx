import type React from "react"
import { Card } from "@/components/ui/card"
import { ThumbsUp, MessageSquare, Share2, Send, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LinkedInPostCard({ post, user, children }: { post: any; user: any; children?: React.ReactNode }) {
  return (
    <Card className="p-4 border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-blue-100 overflow-hidden flex-shrink-0">
          {user.avatar_url ? (
            <img
              src={user.avatar_url || "/placeholder.svg"}
              alt={user.full_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-lg font-semibold">
              {user.full_name?.[0] || "U"}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex flex-col">
            <span className="font-semibold">{user.full_name || "User Name"}</span>
            <span className="text-sm text-gray-500">{user.headline || "Professional Headline"}</span>
            <span className="text-xs text-gray-400">
              2h • <Globe className="h-3 w-3 inline" />
            </span>
          </div>

          <div className="mt-3 whitespace-pre-line text-gray-800">{post.caption || "Your post will appear here"}</div>

          {post.image_url && (
            <div className="mt-3 rounded-lg overflow-hidden border border-gray-100">
              <img src={post.image_url || "/placeholder.svg"} alt="Post image" className="w-full object-cover" />
            </div>
          )}

          {children}

          {post.hashtags && post.hashtags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {post.hashtags.map((tag: string, index: number) => (
                <span key={index} className="text-blue-600 hover:underline cursor-pointer">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between">
            <Button variant="ghost" size="sm" className="gap-1 text-gray-500 hover:text-blue-600">
              <ThumbsUp className="h-4 w-4" />
              <span>Like</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 text-gray-500 hover:text-blue-600">
              <MessageSquare className="h-4 w-4" />
              <span>Comment</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 text-gray-500 hover:text-blue-600">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 text-gray-500 hover:text-blue-600">
              <Send className="h-4 w-4" />
              <span>Send</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
