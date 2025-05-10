"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Download,
  FileArchiveIcon as FileZip,
  Instagram,
  X,
  CheckCircle2,
  Filter,
  SlidersHorizontal,
  Search,
  Info,
} from "lucide-react"
import { getPosts, getPost, updatePost, deletePost } from "@/lib/actions/posts"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import JSZip from "jszip"
import { saveAs } from "file-saver"

export default function SummaryPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingPost, setEditingPost] = useState<any | null>(null)
  const [viewingPost, setViewingPost] = useState<any | null>(null)
  const [deletingPost, setDeletingPost] = useState<any | null>(null)
  const [editCaption, setEditCaption] = useState("")
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true)
      let data = await getPosts(undefined, sortBy, statusFilter, searchQuery)
      setPosts(data || [])
      setIsLoading(false)
    }
    fetchPosts()
  }, [sortBy, statusFilter, searchQuery])

  const handleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(posts.map((post) => post.id))
    }
  }

  const handleSelectPost = (postId: string) => {
    if (selectedPosts.includes(postId)) {
      setSelectedPosts(selectedPosts.filter((id) => id !== postId))
    } else {
      setSelectedPosts([...selectedPosts, postId])
    }
  }

  const handleExportZip = async () => {
    if (selectedPosts.length === 0) return
    setIsExporting(true)
    try {
      const selected = posts.filter((post) => selectedPosts.includes(post.id));
      const res = await fetch('/api/export-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: selected })
      })
      if (!res.ok) throw new Error('Failed to export ZIP')
      const blob = await res.blob()
      saveAs(blob, `posts_export_${Date.now()}.zip`)
      setSuccessMessage(`Successfully exported ${selected.length} posts as ZIP`)
    } catch (e) {
      setSuccessMessage('Failed to export ZIP')
    }
    setIsExporting(false)
    setShowSuccessBanner(true)
    setTimeout(() => setShowSuccessBanner(false), 5000)
  }

  const handleExportCSV = async () => {
    if (selectedPosts.length === 0) return
    setIsExporting(true)
    const selected = posts.filter((post) => selectedPosts.includes(post.id))
    // CSV header
    let csv = 'ID,Caption,Status,Created At\n'
    csv += selected.map(post => `"${post.id}","${post.caption.replace(/"/g, '""')}","${post.status}","${post.created_at}"`).join("\n")
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, `captions_export_${Date.now()}.csv`)
    setIsExporting(false)
    setSuccessMessage(`Successfully exported ${selected.length} captions as CSV`)
    setShowSuccessBanner(true)
    setTimeout(() => setShowSuccessBanner(false), 5000)
  }

  const handlePublishToInstagram = async () => {
    if (selectedPosts.length === 0) return;
    setIsExporting(true);
    try {
      const selected = posts.filter((post) => selectedPosts.includes(post.id));
      let successCount = 0;
      for (const post of selected) {
        const res = await fetch('/api/publish-instagram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_url: post.image_url, caption: post.caption })
        });
        if (res.ok) successCount++;
      }
      setSuccessMessage(`Successfully published ${successCount} of ${selected.length} posts to Instagram`);
    } catch (e) {
      setSuccessMessage('Failed to publish to Instagram');
    }
    setIsExporting(false);
    setShowSuccessBanner(true);
    setTimeout(() => setShowSuccessBanner(false), 5000);
  }

  // Fetch single post for view/edit
  const handleViewDetails = async (postId: string) => {
    setViewingPost(null)
    const post = await getPost(postId)
    setViewingPost(post)
  }
  const handleEditCaption = async (postId: string) => {
    setEditingPost(null)
    setEditCaption("")
    const post = await getPost(postId)
    if (!post) return;
    setEditingPost(post as any)
    setEditCaption((post as any).caption)
  }
  const handleDeletePost = (post: any) => {
    setDeletingPost(post)
  }
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPost) return
    setEditLoading(true)
    const formData = new FormData()
    formData.set("caption", editCaption)
    formData.set("status", editingPost.status)
    if (editingPost.scheduled_for) formData.set("scheduledFor", editingPost.scheduled_for)
    const res = await updatePost(editingPost.id, formData)
    setEditLoading(false)
    setEditingPost(null)
    setEditCaption("")
    // Refresh posts
    setIsLoading(true)
    let data = await getPosts(undefined, sortBy, statusFilter, searchQuery)
    setPosts(data || [])
    setIsLoading(false)
    setSuccessMessage("Caption updated!")
    setShowSuccessBanner(true)
  }
  const handleDeleteConfirm = async () => {
    if (!deletingPost) return
    setDeleteLoading(true)
    await deletePost(deletingPost.id)
    setDeleteLoading(false)
    setDeletingPost(null)
    // Refresh posts
    setIsLoading(true)
    let data = await getPosts(undefined, sortBy, statusFilter, searchQuery)
    setPosts(data || [])
    setIsLoading(false)
    setSuccessMessage("Post deleted!")
    setShowSuccessBanner(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {showSuccessBanner && (
        <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950/30">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-400">Success</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">{successMessage}</AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6 text-green-700 dark:text-green-400"
            onClick={() => setShowSuccessBanner(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </Alert>
      )}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Generated Posts</h1>
          <p className="text-muted-foreground mt-1">Manage and export your AI-generated social media content</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={handleExportZip}
                  disabled={selectedPosts.length === 0 || isExporting}
                  className="flex items-center gap-2"
                >
                  <FileZip className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span> ZIP
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download images and captions as a ZIP archive</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={handleExportCSV}
                  disabled={selectedPosts.length === 0 || isExporting}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span> CSV
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export captions as a CSV file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            onClick={handlePublishToInstagram}
            disabled={selectedPosts.length === 0 || isExporting}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Instagram className="h-4 w-4" />
            <span className="hidden sm:inline">Publish to</span> Instagram
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search captions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setStatusFilter("all")} className={statusFilter === "all" ? "bg-muted" : ""}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("draft")} className={statusFilter === "draft" ? "bg-muted" : ""}>Draft</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("scheduled")} className={statusFilter === "scheduled" ? "bg-muted" : ""}>Scheduled</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("published")} className={statusFilter === "published" ? "bg-muted" : ""}>Published</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-4 flex items-center justify-between bg-muted/40 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={selectedPosts.length === posts.length && posts.length > 0}
            onCheckedChange={handleSelectAll}
            aria-label="Select all posts"
          />
          <label htmlFor="select-all" className="text-sm font-medium">
            Select All
          </label>
        </div>
        <div className="flex items-center gap-2">
          {selectedPosts.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedPosts.length} selected
            </Badge>
          )}
          <p className="text-sm text-muted-foreground">
            Showing {posts.length} of {posts.length} posts
          </p>
          {searchQuery && (
            <Badge variant="outline" className="gap-1 flex items-center">
              Search: {searchQuery}
              <button onClick={() => setSearchQuery("")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      </div>

      {posts.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Info className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No posts found</h3>
          <p className="text-muted-foreground max-w-md">
            {searchQuery
              ? `No posts match your search "${searchQuery}". Try a different search term.`
              : "You don't have any generated posts yet. Generate some content to get started."}
          </p>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery("")} className="mt-4">
              Clear search
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {isLoading
          ? Array.from({ length: 12 }).map((_, idx) => (
              <Card key={idx} className="overflow-hidden">
                <div className="absolute left-2 top-2 z-10">
                  <Skeleton className="h-5 w-5 rounded-sm" />
                </div>
                <div className="relative aspect-square overflow-hidden w-full bg-muted/70 skeleton-shimmer flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-muted-foreground/40"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 16 20"
                  >
                    <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                  </svg>
                </div>
                <CardContent className="p-2">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))
          : posts.map((post: any) => {
              if (!post) return null;
              const isSelected = selectedPosts.includes(post.id)
              return (
                <Card
                  key={post.id}
                  className={`group overflow-hidden transition-all hover:shadow-md relative border-2 ${isSelected ? 'border ring-2 ring-primary/40 bg-primary/5' : 'border'}`}
                >
                  <div className="absolute left-2 top-2 z-10">
                    <Checkbox
                      id={`select-${post.id}`}
                      checked={isSelected}
                      onCheckedChange={() => handleSelectPost(post.id)}
                      aria-label={`Select post ${post.id}`}
                      className="h-5 w-5 rounded-sm border-2 bg-white/90"
                    />
                  </div>
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={post.image_url || `/placeholder.svg?height=200&width=200&text=${post.id}`}
                      alt={`Post ${post.id}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-3">
                    <p className="text-xs line-clamp-2">{post.caption}</p>
                  </CardContent>
                  <CardFooter className="p-2 pt-0 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <SlidersHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditCaption(post.id)}>Edit caption</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewDetails(post.id)}>View details</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500" onClick={() => handleDeletePost(post)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              )
            })}
      </div>

      {isExporting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
          <div className="rounded-lg bg-background p-8 shadow-lg max-w-md w-full">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <div>
                <p className="text-xl font-medium mb-2">Processing your request</p>
                <p className="text-muted-foreground">This may take a moment. Please don't close this window.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Caption Dialog */}
      <Dialog open={!!editingPost} onOpenChange={v => { if (!v) setEditingPost(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Caption</DialogTitle>
            <DialogDescription>Edit the caption for your post.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Label htmlFor="caption">Caption</Label>
            <Textarea id="caption" value={editCaption} onChange={e => setEditCaption(e.target.value)} rows={4} required />
            <DialogFooter>
              <Button type="submit" disabled={editLoading}>{editLoading ? "Saving..." : "Save"}</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={!!viewingPost} onOpenChange={v => { if (!v) setViewingPost(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Post Details</DialogTitle>
          </DialogHeader>
          {viewingPost && (
            <div className="space-y-2">
              <Image src={viewingPost.image_url || "/placeholder.svg?height=200&width=200"} alt="Post image" width={300} height={300} className="rounded" />
              <div><b>Caption:</b> {viewingPost.caption}</div>
              <div><b>Status:</b> {viewingPost.status}</div>
              <div><b>Created:</b> {viewingPost.created_at ? new Date(viewingPost.created_at).toLocaleString() : "No date"}</div>
              <div><b>Updated:</b> {viewingPost.updated_at ? new Date(viewingPost.updated_at).toLocaleString() : "No date"}</div>
              {viewingPost.scheduled_for && <div><b>Scheduled for:</b> {new Date(viewingPost.scheduled_for).toLocaleString()}</div>}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingPost} onOpenChange={v => { if (!v) setDeletingPost(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>Are you sure you want to delete this post? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {deletingPost && <>
              <div><b>Caption:</b> {deletingPost.caption}</div>
              <div><b>Status:</b> {deletingPost.status}</div>
            </>}
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleteLoading}>{deleteLoading ? "Deleting..." : "Delete"}</Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
