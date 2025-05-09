// "use client"

// import { useState, useEffect } from "react"
// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Download, FileArchiveIcon as FileZip, Instagram, X, CheckCircle2 } from "lucide-react"
// import { getPosts } from "@/lib/actions/posts"
// import { Skeleton } from "@/components/ui/skeleton"

// export default function SummaryPage() {
//   const [posts, setPosts] = useState<any[]>([])
//   const [selectedPosts, setSelectedPosts] = useState<string[]>([])
//   const [showSuccessBanner, setShowSuccessBanner] = useState(false)
//   const [successMessage, setSuccessMessage] = useState("")
//   const [isExporting, setIsExporting] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     async function fetchPosts() {
//       setIsLoading(true)
//       const data = await getPosts()
//       setPosts(data || [])
//       setIsLoading(false)
//     }
//     fetchPosts()
//   }, [])

//   const handleSelectAll = () => {
//     if (selectedPosts.length === posts.length) {
//       setSelectedPosts([])
//     } else {
//       setSelectedPosts(posts.map((post) => post.id))
//     }
//   }

//   const handleSelectPost = (postId: string) => {
//     if (selectedPosts.includes(postId)) {
//       setSelectedPosts(selectedPosts.filter((id) => id !== postId))
//     } else {
//       setSelectedPosts([...selectedPosts, postId])
//     }
//   }

//   const handleExportZip = async () => {
//     if (selectedPosts.length === 0) return

//     setIsExporting(true)

//     // Simulate export process
//     await new Promise((resolve) => setTimeout(resolve, 2000))

//     setIsExporting(false)
//     setSuccessMessage(`Successfully exported ${selectedPosts.length} posts as ZIP`)
//     setShowSuccessBanner(true)

//     // Auto-hide success banner after 5 seconds
//     setTimeout(() => {
//       setShowSuccessBanner(false)
//     }, 5000)
//   }

//   const handleExportCSV = async () => {
//     if (selectedPosts.length === 0) return

//     setIsExporting(true)

//     // Simulate export process
//     await new Promise((resolve) => setTimeout(resolve, 1500))

//     setIsExporting(false)
//     setSuccessMessage(`Successfully exported ${selectedPosts.length} captions as CSV`)
//     setShowSuccessBanner(true)

//     // Auto-hide success banner after 5 seconds
//     setTimeout(() => {
//       setShowSuccessBanner(false)
//     }, 5000)
//   }

//   const handlePublish = async () => {
//     if (selectedPosts.length === 0) return

//     setIsExporting(true)

//     // Simulate publish process
//     await new Promise((resolve) => setTimeout(resolve, 3000))

//     setIsExporting(false)
//     setSuccessMessage(`Successfully published ${selectedPosts.length} posts to Instagram`)
//     setShowSuccessBanner(true)

//     // Auto-hide success banner after 5 seconds
//     setTimeout(() => {
//       setShowSuccessBanner(false)
//     }, 5000)
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {showSuccessBanner && (
//         <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950/30">
//           <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
//           <AlertTitle className="text-green-800 dark:text-green-400">Success</AlertTitle>
//           <AlertDescription className="text-green-700 dark:text-green-400">{successMessage}</AlertDescription>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="absolute right-2 top-2 h-6 w-6 text-green-700 dark:text-green-400"
//             onClick={() => setShowSuccessBanner(false)}
//           >
//             <X className="h-4 w-4" />
//             <span className="sr-only">Close</span>
//           </Button>
//         </Alert>
//       )}

//       <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <h1 className="text-3xl font-bold">Generated Posts</h1>
//         <div className="flex flex-wrap gap-2">
//           <Button
//             variant="outline"
//             onClick={handleExportZip}
//             disabled={selectedPosts.length === 0 || isExporting}
//             className="flex items-center gap-2"
//           >
//             <FileZip className="h-4 w-4" />
//             Export ZIP
//           </Button>
//           <Button
//             variant="outline"
//             onClick={handleExportCSV}
//             disabled={selectedPosts.length === 0 || isExporting}
//             className="flex items-center gap-2"
//           >
//             <Download className="h-4 w-4" />
//             Download Captions CSV
//           </Button>
//           <Button
//             onClick={handlePublish}
//             disabled={selectedPosts.length === 0 || isExporting}
//             className="flex items-center gap-2"
//           >
//             <Instagram className="h-4 w-4" />
//             Publish to Instagram
//           </Button>
//         </div>
//       </div>

//       <div className="mb-4 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Checkbox
//             id="select-all"
//             checked={selectedPosts.length === posts.length && posts.length > 0}
//             onCheckedChange={handleSelectAll}
//             aria-label="Select all posts"
//           />
//           <label htmlFor="select-all" className="text-sm font-medium">
//             Select All
//           </label>
//         </div>
//         <p className="text-sm text-muted-foreground">
//           {selectedPosts.length} of {posts.length} selected
//         </p>
//       </div>

//       <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
//         {isLoading
//           ? Array.from({ length: 12 }).map((_, idx) => (
//               <div key={idx} className="relative rounded-lg border bg-card">
//                 <div className="absolute left-2 top-2 z-10">
//                   <Skeleton className="h-5 w-5 rounded-sm" />
//                 </div>
//                 <div className="relative aspect-square overflow-hidden rounded-t-lg w-full bg-muted/70 skeleton-shimmer flex items-center justify-center">
//                   <svg className="w-10 h-10 text-muted-foreground/40" aria-hidden="true" fill="currentColor" viewBox="0 0 16 20">
//                     <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
//                     <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
//                   </svg>
//                 </div>
//                 <div className="p-2">
//                   <Skeleton className="h-4 w-3/4 mb-2" />
//                   <Skeleton className="h-3 w-1/2" />
//                 </div>
//               </div>
//             ))
//           : posts.map((post) => (
//               <div key={post.id} className="relative rounded-lg border bg-card">
//                 <div className="absolute left-2 top-2 z-10">
//                   <Checkbox
//                     id={`select-${post.id}`}
//                     checked={selectedPosts.includes(post.id)}
//                     onCheckedChange={() => handleSelectPost(post.id)}
//                     aria-label={`Select post ${post.id}`}
//                     className="h-5 w-5 rounded-sm border-2 bg-white/90"
//                   />
//                 </div>
//                 <div className="relative aspect-square overflow-hidden rounded-t-lg">
//                   <Image
//                     src={post.image_url || `/placeholder.svg?height=200&width=200&text=${post.id}`}
//                     alt={`Post ${post.id}`}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 <div className="p-2">
//                   <p className="text-xs line-clamp-2">{post.caption}</p>
//                 </div>
//               </div>
//             ))}
//       </div>

//       {isExporting && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
//           <div className="rounded-lg bg-background p-6 shadow-lg">
//             <div className="flex flex-col items-center gap-4">
//               <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
//               <p className="text-lg font-medium">Processing...</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Download,
  FileArchiveIcon as FileZip,
  Instagram,
  X,
  CheckCircle2,
  ArrowLeft,
  Filter,
  MoreHorizontal,
} from "lucide-react"
import { getPosts } from "@/lib/actions/posts"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SummaryPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true)
      const data = await getPosts()
      setPosts(data || [])
      setIsLoading(false)
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
    <div className="container mx-auto px-4 py-6">
      {/* Success Banner */}
      {showSuccessBanner && (
        <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950/30 animate-in slide-in-from-top-5 duration-300">
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

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8 mr-1">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Content Summary</h1>
          <Badge variant="outline" className="ml-2 bg-primary/5 text-primary">
            {posts.length} Posts
          </Badge>
        </div>
        <p className="text-muted-foreground">Manage and export your generated content</p>
      </div>

      {/* Action Bar */}
      <div className="mb-8 rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              id="select-all"
              checked={selectedPosts.length === posts.length && posts.length > 0}
              onCheckedChange={handleSelectAll}
              aria-label="Select all posts"
              className="h-5 w-5 rounded-md"
            />
            <label htmlFor="select-all" className="text-sm font-medium">
              Select All
            </label>
            <Badge variant="secondary" className="ml-2">
              {selectedPosts.length} of {posts.length} selected
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handleExportZip}
              disabled={selectedPosts.length === 0 || isExporting}
              className="flex items-center gap-2"
              size="sm"
            >
              <FileZip className="h-4 w-4" />
              Export ZIP
            </Button>
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={selectedPosts.length === 0 || isExporting}
              className="flex items-center gap-2"
              size="sm"
            >
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
            <Button
              onClick={handlePublish}
              disabled={selectedPosts.length === 0 || isExporting}
              className="flex items-center gap-2"
              size="sm"
            >
              <Instagram className="h-4 w-4" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>

            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <TabsContent value="all" className="mt-0">
            {/* Grid of Posts */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {isLoading
                ? Array.from({ length: 12 }).map((_, idx) => (
                    <Card key={idx} className="overflow-hidden border border-border/50">
                      <div className="absolute left-2 top-2 z-10">
                        <Skeleton className="h-5 w-5 rounded-md" />
                      </div>
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <div className="absolute inset-0 flex items-center justify-center">
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
                      </div>
                      <CardContent className="p-3">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                      </CardContent>
                    </Card>
                  ))
                : posts.map((post) => (
                    <Card
                      key={post.id}
                      className="group overflow-hidden border border-border/50 bg-card transition-all duration-300 hover:shadow-md hover:border-primary/20"
                    >
                      <div className="absolute left-2 top-2 z-10">
                        <Checkbox
                          id={`select-${post.id}`}
                          checked={selectedPosts.includes(post.id)}
                          onCheckedChange={() => handleSelectPost(post.id)}
                          aria-label={`Select post ${post.id}`}
                          className="h-5 w-5 rounded-md border-2 bg-white/90"
                        />
                      </div>
                      <div className="absolute right-2 top-2 z-10">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Post</DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Download</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={post.image_url || `/placeholder.svg?height=200&width=200&text=${post.id}`}
                          alt={`Post ${post.id}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <CardContent className="p-3">
                        <p className="text-xs line-clamp-2 text-muted-foreground">{post.caption}</p>
                      </CardContent>
                      <CardFooter className="p-3 pt-0 flex justify-between items-center">
                        <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                          Instagram
                        </Badge>
                        <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</span>
                      </CardFooter>
                    </Card>
                  ))}
            </div>
          </TabsContent>

          <TabsContent value="published" className="mt-0">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Instagram className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Published Posts</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Select posts and use the "Publish" button to send them to Instagram
              </p>
            </div>
          </TabsContent>

          <TabsContent value="drafts" className="mt-0">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <FileZip className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Draft Posts</h3>
              <p className="text-muted-foreground max-w-md mb-6">All your generated posts are ready for publishing</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Processing Overlay */}
      {isExporting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-in fade-in duration-200">
          <div className="rounded-lg bg-background p-8 shadow-lg">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-lg font-medium">Processing your request...</p>
              <p className="text-sm text-muted-foreground">This may take a moment</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
