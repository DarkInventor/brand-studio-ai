import { MessageCircle, Heart, Repeat2, Share2, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function TweetCard({ post, user }: { post: any; user: any }) {
  return (
    <Card className="max-w-xl border rounded-lg hover:bg-slate-50 transition-colors">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage
              src={user?.avatar_url || "/placeholder.svg?height=40&width=40&query=avatar"}
              alt={user?.full_name || "User"}
            />
            <AvatarFallback>{user?.full_name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold hover:underline">{user?.full_name || "User"}</span>
                <span className="text-muted-foreground">@{user?.username || "username"}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </div>
            <div className="text-base">
              <p className="whitespace-pre-line">{post.caption || ""}</p>
            </div>
            {post.image_url && (
              <div className="mt-3 rounded-xl overflow-hidden">
                <img
                  src={post.image_url || "/placeholder.svg"}
                  alt="Tweet image"
                  className="w-full object-cover border border-gray-100 rounded-xl"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-0">
        <div className="flex items-center justify-between w-full px-6 py-2">
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-blue-600">
            <MessageCircle className="h-4 w-4" />
            <span>0</span>
            <span className="sr-only">Reply</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-green-600">
            <Repeat2 className="h-4 w-4" />
            <span>0</span>
            <span className="sr-only">Retweet</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-red-600">
            <Heart className="h-4 w-4" />
            <span>0</span>
            <span className="sr-only">Like</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-blue-600">
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
