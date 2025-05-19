"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  RefreshCw,
  X,
  Save,
  Calendar,
  Clock,
  Instagram,
  Hash,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react"
import { updatePost } from "@/lib/actions/posts"
import type { Post } from "@/lib/supabase/database.types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select } from "@/components/ui/select"

interface PostEditorModalProps {
  isOpen: boolean
  onClose: () => void
  post: Post
  onSave: (post: Post) => void
}

export function PostEditorModal({ isOpen, onClose, post, onSave }: PostEditorModalProps) {
  const [caption, setCaption] = useState(post.caption)
  const [platform, setPlatform] = useState(post.platform || 'instagram')
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPostIndex, setCurrentPostIndex] = useState(0)

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)

    const formData = new FormData()
    formData.append("caption", caption)
    formData.append("status", post.status)
    if (post.scheduled_for) {
      formData.append("scheduledFor", post.scheduled_for)
    }

    const result = await updatePost(post.id, formData)

    if (result?.error) {
      setError(result.error)
      setIsSaving(false)
    } else if (result?.data) {
      onSave(result.data as Post)
      setIsSaving(false)
      onClose()
    }
  }

  const handleRegenerate = () => {
    setIsRegenerating(true)

    // Simulate regeneration process
    setTimeout(() => {
      // In a real app, this would call an AI service to regenerate the caption
      setCaption(`Newly regenerated caption for this post. #BrandNew #Fresh #${Math.floor(Math.random() * 1000)}`)
      setIsRegenerating(false)
    }, 1500)
  }

  // Extract hashtags from caption
  const hashtags = caption.match(/#[a-zA-Z0-9_]+/g) || []

  // These functions would normally navigate between posts
  // Currently they're just UI placeholders since we can't modify the logic
  const handlePrevPost = () => {
    // Show a visual feedback that this is just UI
    const prevButton = document.querySelector(".prev-button") as HTMLElement
    if (prevButton) {
      prevButton.classList.add("animate-pulse")
      setTimeout(() => prevButton.classList.remove("animate-pulse"), 500)
    }
  }

  const handleNextPost = () => {
    // Show a visual feedback that this is just UI
    const nextButton = document.querySelector(".next-button") as HTMLElement
    if (nextButton) {
      nextButton.classList.add("animate-pulse")
      setTimeout(() => nextButton.classList.remove("animate-pulse"), 500)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl p-0 h-[90vh] overflow-hidden">
        <div className="grid h-full grid-cols-1 md:grid-cols-2">
          {/* Image Preview */}
          <div className="relative flex items-center justify-center bg-black/95 p-4 md:p-8">
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-4 h-8 w-8 rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>

            <div className="relative h-full w-full flex items-center justify-center">
              <div className="relative aspect-square max-h-[80vh] w-auto overflow-hidden rounded-md border border-white/10 shadow-xl">
                <Image
                  src={post.image_url || "/placeholder.svg"}
                  alt={`Instagram post`}
                  width={600}
                  height={600}
                  className="object-contain"
                />
                {isRegenerating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="h-12 w-12 animate-spin text-white" />
                      <p className="text-sm text-white">Regenerating caption...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex justify-between">
              <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                {platform === 'instagram' && <Instagram className="mr-1 h-3 w-3" />} 
                {platform === 'twitter' && <Hash className="mr-1 h-3 w-3" />} 
                {platform === 'linkedin' && <Sparkles className="mr-1 h-3 w-3" />} 
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Caption Editor */}
          <div className="flex flex-col overflow-auto">
            <DialogHeader className="sticky top-0 z-10 bg-background px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl">Edit Post</DialogTitle>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant={post.status === "published" ? "success" : "secondary"} className="capitalize">
                      {post.status}
                    </Badge>
                    {post.scheduled_for && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.scheduled_for).toLocaleDateString()}
                        <Clock className="ml-1 h-3 w-3" />
                        {new Date(post.scheduled_for).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={platform} onValueChange={setPlatform}>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter/X</option>
                    <option value="linkedin">LinkedIn</option>
                  </Select>
                  <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="flex-1 px-6 py-4 overflow-auto">
              {error && (
                <Alert variant="destructive" className="mb-4 animate-in slide-in-from-top-5 duration-300">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue="edit" className="w-full">
                <TabsList className="mb-4 w-full">
                  <TabsTrigger value="edit" className="flex-1">
                    Edit Caption
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex-1">
                    Instagram Preview
                  </TabsTrigger>
                  <TabsTrigger value="hashtags" className="flex-1">
                    Hashtags ({hashtags.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="edit" className="mt-0">
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label htmlFor="caption" className="text-sm font-medium">
                          Caption
                        </label>
                      </div>
                      <Textarea
                        id="caption"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Write a caption for your post..."
                        className="min-h-[240px] resize-none"
                      />
                      <p className="mt-2 text-xs text-muted-foreground">
                        {caption.length} characters • {caption.split(/\s+/).filter(Boolean).length} words •{" "}
                        {hashtags.length} hashtags
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="mt-0">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Instagram Post Preview</h3>
                      <Badge variant="outline" className="text-xs">
                        <ChevronDown className="mr-1 h-3 w-3" />
                        Scroll to see full post
                      </Badge>
                    </div>

                    <div className="instagram-preview-container border rounded-md shadow-sm overflow-hidden max-h-[500px]">
                      <ScrollArea className="h-[500px] w-full rounded-md">
                        <div className="instagram-preview">
                          {/* Instagram Header */}
                          <div className="sticky top-0 z-10 flex items-center justify-between border-b p-3 bg-background">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg?height=32&width=32&text=YB" alt="@yourbrand" />
                                <AvatarFallback>YB</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">yourbrand</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Post Image */}
                          <div className="aspect-square relative">
                            <Image
                              src={post.image_url || "/placeholder.svg"}
                              alt="Instagram post"
                              width={600}
                              height={600}
                              className="object-cover w-full h-full"
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                                  <Heart className="h-6 w-6" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                                  <MessageCircle className="h-6 w-6" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                                  <Share2 className="h-6 w-6" />
                                </Button>
                              </div>
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                                <Bookmark className="h-6 w-6" />
                              </Button>
                            </div>

                            {/* Likes */}
                            <p className="text-sm font-medium mb-1">123 likes</p>

                            {/* Caption */}
                            <div className="mb-4">
                              <p className="text-sm whitespace-pre-wrap">
                                <span className="font-medium">yourbrand</span> {caption}
                              </p>
                            </div>

                            {/* Comments */}
                            <div className="space-y-3 mb-4">
                              <p className="text-sm text-muted-foreground">View all 24 comments</p>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback>U1</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm">
                                      <span className="font-medium">user1</span> Love this content! 🔥
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <p className="text-xs text-muted-foreground">2d</p>
                                      <p className="text-xs text-muted-foreground">Reply</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback>U2</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm">
                                      <span className="font-medium">user2</span> Great post! Can't wait to see more.
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <p className="text-xs text-muted-foreground">1d</p>
                                      <p className="text-xs text-muted-foreground">Reply</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Time */}
                            <p className="text-xs text-muted-foreground uppercase mb-3">Just now</p>

                            {/* Add Comment */}
                            <div className="flex items-center gap-2 border-t pt-3">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback>YB</AvatarFallback>
                              </Avatar>
                              <Input
                                placeholder="Add a comment..."
                                className="h-8 bg-transparent border-none text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                              <Button variant="ghost" size="sm" className="text-primary text-sm font-medium">
                                Post
                              </Button>
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        This is a preview of how your post will appear on Instagram.
                        <br />
                        The actual appearance may vary slightly.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="hashtags" className="mt-0">
                  <div className="rounded-md border p-4">
                    {hashtags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {hashtags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Hash className="mr-1 h-3 w-3" />
                            {tag.substring(1)}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-sm text-muted-foreground py-4">
                        No hashtags found. Add hashtags to your caption to improve discoverability.
                      </p>
                    )}
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Suggested Hashtags</h4>
                    <div className="flex flex-wrap gap-2">
                      {["marketing", "socialmedia", "digital", "branding", "business"].map((tag) => (
                        <Button
                          key={tag}
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => setCaption(caption + ` #${tag}`)}
                        >
                          <Hash className="mr-1 h-3 w-3" />
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <DialogFooter className="sticky bottom-0 border-t bg-background px-6 py-4">
              <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex items-center gap-2" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
