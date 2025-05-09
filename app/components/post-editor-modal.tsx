"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { RefreshCw, X, Save } from "lucide-react"
import { updatePost } from "@/lib/actions/posts"
import type { Post } from "@/lib/supabase/database.types"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PostEditorModalProps {
  isOpen: boolean
  onClose: () => void
  post: Post
  onSave: (post: Post) => void
}

export function PostEditorModal({ isOpen, onClose, post, onSave }: PostEditorModalProps) {
  const [caption, setCaption] = useState(post.caption)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl p-0 h-[90vh] overflow-hidden">

        <div className="grid h-full grid-cols-1 md:grid-cols-2">
          {/* Image Preview */}
          <div className="flex items-center justify-center bg-black p-4 md:p-8">
            <div className="relative h-full w-full">
              <Image
                src={post.image_url || "/placeholder.svg"}
                alt={`Instagram post`}
                fill
                className="object-contain"
              />
              {isRegenerating && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <RefreshCw className="h-12 w-12 animate-spin text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Caption Editor */}
          <div className="flex flex-col p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">Edit Post</h2>
              <p className="text-sm text-muted-foreground">
                Status: <span className="capitalize">{post.status}</span>
                {post.scheduled_for && <> • Scheduled for: {new Date(post.scheduled_for).toLocaleString()}</>}
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="mb-4 flex-1">
              <label htmlFor="caption" className="mb-2 block text-sm font-medium">
                Caption
              </label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption for your post..."
                className="min-h-[200px] resize-none"
              />
            </div>

            <div className="mt-auto flex flex-col gap-3 sm:flex-row">
              {/* <Button
                variant="outline"
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="flex items-center gap-2"
              >
                {isRegenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Regenerate Caption
                  </>
                )}
              </Button> */}
              <Button onClick={handleSave} className="sm:ml-auto flex items-center gap-2" disabled={isSaving}>
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
