"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Loader2, RefreshCw, Calendar, Package, Edit, Trash2 } from "lucide-react"
import { generatePosts, getPosts, deletePost } from "@/lib/actions/posts"
import { getBrandKits } from "@/lib/actions/brand-kits"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PostEditorModal } from "@/app/components/post-editor-modal"
import type { Post } from "@/lib/supabase/database.types"
import { Input } from "@/components/ui/input"

export default function ImagePosts() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [brandKits, setBrandKits] = useState<any[]>([])
  const [selectedBrandKit, setSelectedBrandKit] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const [numberOfAds, setNumberOfAds] = useState(1)

  useEffect(() => {
    async function checkAuth() {
      setIsLoading(true)
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
        return
      }

      setIsAuthenticated(true)

      // Load brand kits
      const brandKitsData = await getBrandKits()
      setBrandKits(brandKitsData)

      if (brandKitsData.length > 0) {
        setSelectedBrandKit(brandKitsData[0].id)

        // Load posts for the first brand kit
        const postsData = await getPosts(brandKitsData[0].id)
        setPosts(postsData as Post[])
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  async function handleBrandKitChange(value: string) {
    setSelectedBrandKit(value)
    setIsLoading(true)

    const postsData = await getPosts(value)
    setPosts(postsData as Post[])

    setIsLoading(false)
  }

  async function handleGeneratePosts() {
    if (!selectedBrandKit) {
      setError("Please select a brand kit first")
      return
    }

    if (numberOfAds < 1) {
      setError("Please enter a valid number of ads (minimum 1)")
      return
    }

    setIsGenerating(true)
    setError(null)
    setSuccess(null)

    const result = await generatePosts(selectedBrandKit, numberOfAds)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.success)
      setPosts(result.data as Post[])
    }

    setIsGenerating(false)
  }

  async function handleDeletePost() {
    if (!postToDelete) return

    setIsDeleting(true)

    const result = await deletePost(postToDelete)

    if (result?.error) {
      setError(result.error)
    } else {
      // Remove the deleted post from the state
      setPosts(posts.filter((post) => post.id !== postToDelete))
      setSuccess("Post deleted successfully")
    }

    setIsDeleting(false)
    setPostToDelete(null)
  }

  function openPostEditor(post: Post) {
    setSelectedPost(post)
    setIsEditing(true)
  }

  function confirmDeletePost(postId: string) {
    setPostToDelete(postId)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-3">
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Instagram Post Generator</h1>

        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          {brandKits.length > 0 ? (
            <Select value={selectedBrandKit} onValueChange={handleBrandKitChange}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select brand kit" />
              </SelectTrigger>
              <SelectContent>
                {brandKits.map((brandKit) => (
                  <SelectItem key={brandKit.id} value={brandKit.id}>
                    {brandKit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Link href="/brand-kit">
              <Button variant="outline" className="w-full sm:w-auto">
                Create Brand Kit
              </Button>
            </Link>
          )}

          {brandKits.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min="1"
                  value={numberOfAds}
                  onChange={(e) => setNumberOfAds(parseInt(e.target.value) || 1)}
                  placeholder="Number of ads"
                  className="w-24"
                />
                <Button
                  size="default"
                  onClick={handleGeneratePosts}
                  disabled={isGenerating || !selectedBrandKit}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Generate Posts
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <Link href="/brand-kit">
              <Button variant="outline" className="w-full sm:w-auto">
                Create Brand Kit
              </Button>
            </Link>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-500 bg-green-50">
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-square animate-pulse bg-muted"></div>
              <CardFooter className="p-4">
                <div className="space-y-2 w-full">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="animate-in fade-in">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-end">
            <Link href="/scheduler" className="w-full sm:w-auto">
              <Button variant="outline" className="flex items-center gap-2 w-full">
                <Calendar className="h-4 w-4" />
                Schedule Posts
              </Button>
            </Link>
            <Link href="/summary" className="w-full sm:w-auto">
              <Button variant="outline" className="flex items-center gap-2 w-full">
                <Package className="h-4 w-4" />
                View Summary
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px] group"
              >
                <CardContent className="p-0 relative">
                  <Image
                    src={post.image_url || "/placeholder.svg"}
                    alt={`Instagram post`}
                    width={400}
                    height={400}
                    className="aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="flex w-full gap-2">
                      <Button size="sm" variant="secondary" className="flex-1" onClick={() => openPostEditor(post)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => confirmDeletePost(post.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.caption}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center animate-in fade-in">
          <div className="mb-6 rounded-full bg-primary/10 p-4">
            <RefreshCw className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">No posts generated yet</h3>
          <p className="mb-6 text-muted-foreground max-w-md">
            {brandKits.length > 0
              ? "Click the button above to generate Instagram posts for your brand"
              : "Create a brand kit first to generate Instagram posts"}
          </p>
          {brandKits.length > 0 ? (
            <Button onClick={handleGeneratePosts} disabled={isGenerating} size="lg">
              Generate Posts
            </Button>
          ) : (
            <Link href="/brand-kit">
              <Button size="lg">Create Brand Kit</Button>
            </Link>
          )}
        </div>
      )}

      {/* Post Editor Modal */}
      {selectedPost && (
        <PostEditorModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          post={selectedPost}
          onSave={async (updatedPost) => {
            // Update the post in the state
            setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)))
            setIsEditing(false)
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPostToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePost} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}