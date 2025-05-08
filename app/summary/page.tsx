"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Download, FileArchiveIcon as FileZip, Instagram, X, CheckCircle2 } from "lucide-react"
import { getPosts } from "@/lib/actions/posts"

export default function SummaryPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    async function fetchPosts() {
      const data = await getPosts()
      setPosts(data || [])
    }
    fetchPosts()
  }, [])

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

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsExporting(false)
    setSuccessMessage(`Successfully exported ${selectedPosts.length} posts as ZIP`)
    setShowSuccessBanner(true)

    // Auto-hide success banner after 5 seconds
    setTimeout(() => {
      setShowSuccessBanner(false)
    }, 5000)
  }

  const handleExportCSV = async () => {
    if (selectedPosts.length === 0) return

    setIsExporting(true)

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsExporting(false)
    setSuccessMessage(`Successfully exported ${selectedPosts.length} captions as CSV`)
    setShowSuccessBanner(true)

    // Auto-hide success banner after 5 seconds
    setTimeout(() => {
      setShowSuccessBanner(false)
    }, 5000)
  }

  const handlePublish = async () => {
    if (selectedPosts.length === 0) return

    setIsExporting(true)

    // Simulate publish process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsExporting(false)
    setSuccessMessage(`Successfully published ${selectedPosts.length} posts to Instagram`)
    setShowSuccessBanner(true)

    // Auto-hide success banner after 5 seconds
    setTimeout(() => {
      setShowSuccessBanner(false)
    }, 5000)
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
        <h1 className="text-3xl font-bold">Generated Posts</h1>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleExportZip}
            disabled={selectedPosts.length === 0 || isExporting}
            className="flex items-center gap-2"
          >
            <FileZip className="h-4 w-4" />
            Export ZIP
          </Button>
          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={selectedPosts.length === 0 || isExporting}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Captions CSV
          </Button>
          <Button
            onClick={handlePublish}
            disabled={selectedPosts.length === 0 || isExporting}
            className="flex items-center gap-2"
          >
            <Instagram className="h-4 w-4" />
            Publish to Instagram
          </Button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
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
        <p className="text-sm text-muted-foreground">
          {selectedPosts.length} of {posts.length} selected
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {posts.map((post) => (
          <div key={post.id} className="relative rounded-lg border bg-card">
            <div className="absolute left-2 top-2 z-10">
              <Checkbox
                id={`select-${post.id}`}
                checked={selectedPosts.includes(post.id)}
                onCheckedChange={() => handleSelectPost(post.id)}
                aria-label={`Select post ${post.id}`}
                className="h-5 w-5 rounded-sm border-2 bg-white/90"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-t-lg">
              <Image
                src={post.image_url || `/placeholder.svg?height=200&width=200&text=${post.id}`}
                alt={`Post ${post.id}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-2">
              <p className="text-xs line-clamp-2">{post.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {isExporting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="rounded-lg bg-background p-6 shadow-lg">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-lg font-medium">Processing...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
