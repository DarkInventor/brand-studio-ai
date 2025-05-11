// "use client"

// import { useState, useEffect } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import { Loader2, RefreshCw, Calendar, Package, Edit, Trash2, ImageIcon, ArrowLeft } from "lucide-react"
// import { generatePosts, getPosts, deletePost } from "@/lib/actions/posts"
// import { getBrandKits } from "@/lib/actions/brand-kits"
// import { createClient } from "@/lib/supabase/client"
// import { useRouter } from "next/navigation"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { PostEditorModal } from "@/app/components/post-editor-modal"
// import type { Post } from "@/lib/supabase/database.types"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"

// export default function ImagePosts() {
//   const router = useRouter()
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [posts, setPosts] = useState<Post[]>([])
//   const [brandKits, setBrandKits] = useState<any[]>([])
//   const [selectedBrandKit, setSelectedBrandKit] = useState<string>("")
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState<string | null>(null)
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [selectedPost, setSelectedPost] = useState<Post | null>(null)
//   const [isEditing, setIsEditing] = useState(false)
//   const [isDeleting, setIsDeleting] = useState(false)
//   const [postToDelete, setPostToDelete] = useState<string | null>(null)
//   const [numberOfAds, setNumberOfAds] = useState(1)

//   useEffect(() => {
//     async function checkAuth() {
//       setIsLoading(true)
//       const supabase = createClient()
//       const {
//         data: { session },
//       } = await supabase.auth.getSession()

//       if (!session) {
//         router.push("/login")
//         return
//       }

//       setIsAuthenticated(true)

//       // Load brand kits
//       const brandKitsData = await getBrandKits()
//       setBrandKits(brandKitsData)

//       if (brandKitsData.length > 0) {
//         setSelectedBrandKit(brandKitsData[0].id)

//         // Load posts for the first brand kit
//         const postsData = await getPosts(brandKitsData[0].id)
//         setPosts(postsData as Post[])
//       }

//       setIsLoading(false)
//     }

//     checkAuth()
//   }, [router])

//   async function handleBrandKitChange(value: string) {
//     setSelectedBrandKit(value)
//     setIsLoading(true)

//     const postsData = await getPosts(value)
//     setPosts(postsData as Post[])

//     setIsLoading(false)
//   }

//   async function handleGeneratePosts() {
//     if (!selectedBrandKit) {
//       setError("Please select a brand kit first")
//       return
//     }

//     if (numberOfAds < 1) {
//       setError("Please enter a valid number of ads (minimum 1)")
//       return
//     }

//     setIsGenerating(true)
//     setError(null)
//     setSuccess(null)

//     const result = await generatePosts(selectedBrandKit, numberOfAds)

//     if (result?.error) {
//       setError(result.error)
//     } else if (result?.success) {
//       setSuccess(result.success)
//       setPosts(result.data as Post[])
//     }

//     setIsGenerating(false)
//   }

//   async function handleDeletePost() {
//     if (!postToDelete) return

//     setIsDeleting(true)

//     const result = await deletePost(postToDelete)

//     if (result?.error) {
//       setError(result.error)
//     } else {
//       // Remove the deleted post from the state
//       setPosts(posts.filter((post) => post.id !== postToDelete))
//       setSuccess("Post deleted successfully")
//     }

//     setIsDeleting(false)
//     setPostToDelete(null)
//   }

//   function openPostEditor(post: Post) {
//     setSelectedPost(post)
//     setIsEditing(true)
//   }

//   function confirmDeletePost(postId: string) {
//     setPostToDelete(postId)
//   }

//   if (isLoading) {
//     return (
//       <div className="container mx-auto flex h-[80vh] items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <Loader2 className="h-10 w-10 animate-spin text-primary" />
//           <p className="text-muted-foreground">Loading your content...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto px-4 py-6">
//       {/* Header Section */}
//       <div className="mb-8">
//         <div className="flex items-center gap-2 mb-2">
//           <Button variant="ghost" size="icon" asChild className="h-8 w-8 mr-1">
//             <Link href="/dashboard">
//               <ArrowLeft className="h-4 w-4" />
//               <span className="sr-only">Back to Dashboard</span>
//             </Link>
//           </Button>
//           <h1 className="text-3xl font-bold tracking-tight">Instagram Posts</h1>
//           <Badge variant="outline" className="ml-2 bg-primary/5 text-primary">
//             AI Generated
//           </Badge>
//         </div>
//         <p className="text-muted-foreground">Create and manage Instagram posts for your brand</p>
//       </div>

//       {/* Controls Section */}
//       <div className="mb-8 rounded-xl border bg-card p-4 shadow-sm">
//         <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <label htmlFor="brand-kit" className="text-sm font-medium">
//                 Brand Kit
//               </label>
//               {brandKits.length > 0 ? (
//                 <Select value={selectedBrandKit} onValueChange={handleBrandKitChange}>
//                   <SelectTrigger id="brand-kit" className="w-full sm:w-[240px]">
//                     <SelectValue placeholder="Select brand kit" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {brandKits.map((brandKit) => (
//                       <SelectItem key={brandKit.id} value={brandKit.id}>
//                         {brandKit.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               ) : (
//                 <Link href="/brand-kit" className=" ml-0 lg:ml-10 md:ml-10">
//                   <Button variant="outline" className="w-full sm:w-auto ml-0 lg:ml-10 md:ml-10">
//                     Create Brand Kit
//                   </Button>
//                 </Link>
//               )}
//             </div>
//           </div>

//           {brandKits.length > 0 && (
//             <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
//               <div className="space-y-2">
//                 <label htmlFor="num-posts" className="text-sm font-medium">
//                   Number of Posts
//                 </label>
//                 <Input
//                   id="num-posts"
//                   type="number"
//                   min="1"
//                   value={numberOfAds}
//                   onChange={(e) => setNumberOfAds(Number.parseInt(e.target.value) || 1)}
//                   className="w-full sm:w-24"
//                 />
//               </div>
//               <Button
//                 size="default"
//                 onClick={handleGeneratePosts}
//                 disabled={isGenerating || !selectedBrandKit}
//                 className="flex items-center gap-2 w-full sm:w-auto"
//               >
//                 {isGenerating ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Generating...
//                   </>
//                 ) : (
//                   <>
//                     <RefreshCw className="h-4 w-4" />
//                     Generate Posts
//                   </>
//                 )}
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Alerts */}
//       {error && (
//         <Alert variant="destructive" className="mb-6 animate-in fade-in slide-in-from-top-5 duration-300">
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       {success && (
//         <Alert className="mb-6 border-green-500 bg-green-50 animate-in fade-in slide-in-from-top-5 duration-300">
//           <AlertDescription className="text-green-700">{success}</AlertDescription>
//         </Alert>
//       )}

//       {/* Action Buttons */}
//       {posts.length > 0 && (
//         <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-end">
//           <Link href="/scheduler" className="w-full sm:w-auto">
//             <Button variant="outline" className="flex items-center gap-2 w-full">
//               <Calendar className="h-4 w-4" />
//               Schedule Posts
//             </Button>
//           </Link>
//           <Link href="/summary" className="w-full sm:w-auto">
//             <Button variant="outline" className="flex items-center gap-2 w-full">
//               <Package className="h-4 w-4" />
//               View Summary
//             </Button>
//           </Link>
//         </div>
//       )}

//       {/* Content Section */}
//       {isLoading ? (
//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//           {Array.from({ length: 8 }).map((_, index) => (
//             <Card key={index} className="overflow-hidden border border-border/50">
//               <div className="aspect-square animate-pulse bg-muted"></div>
//               <CardFooter className="p-4">
//                 <div className="space-y-2 w-full">
//                   <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
//                   <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
//                 </div>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       ) : posts.length > 0 ? (
//         <div className="animate-in fade-in duration-500">
//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//             {posts.map((post) => (
//               <Card
//                 key={post.id}
//                 className="group overflow-hidden border border-border/50 bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:translate-y-[-4px]"
//               >
//                 <CardContent className="p-0 relative">
//                   <div className="aspect-square relative overflow-hidden bg-muted">
//                     <Image
//                       src={post.image_url || "/placeholder.svg"}
//                       alt={`Instagram post`}
//                       fill
//                       className="object-cover transition-transform duration-500 group-hover:scale-105"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
//                       <div className="flex w-full gap-2">
//                         <Button size="sm" variant="default" className="flex-1 " onClick={() => openPostEditor(post)}>
//                           <Edit className="h-4 w-4 mr-1" />
//                           Edit
//                         </Button>
//                         <Button size="sm" variant="destructive" onClick={() => confirmDeletePost(post.id)}>
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//                 <CardFooter className="p-4">
//                   <div className="space-y-2 w-full">
//                     <p className="text-sm text-muted-foreground line-clamp-2">{post.caption}</p>
//                     <div className="flex items-center justify-between">
//                       <Badge variant="outline" className="text-xs px-2 py-0">
//                         Instagram
//                       </Badge>
//                       <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</span>
//                     </div>
//                   </div>
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center animate-in fade-in duration-500">
//           <div className="mb-6 rounded-full bg-primary/10 p-4">
//             <ImageIcon className="h-8 w-8 text-primary" />
//           </div>
//           <h3 className="mb-2 text-xl font-semibold">No posts generated yet</h3>
//           <p className="mb-6 text-muted-foreground max-w-md">
//             {brandKits.length > 0
//               ? "Click the button below to generate Instagram posts for your brand"
//               : "Create a brand kit first to generate Instagram posts"}
//           </p>
//           {brandKits.length > 0 ? (
//             <Button onClick={handleGeneratePosts} disabled={isGenerating} size="lg" className="gap-2">
//               {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
//               Generate Posts
//             </Button>
//           ) : (
//             <Link href="/brand-kit">
//               <Button size="lg">Create Brand Kit</Button>
//             </Link>
//           )}
//         </div>
//       )}

//       {/* Post Editor Modal */}
//       {selectedPost && (
//         <PostEditorModal
//           isOpen={isEditing}
//           onClose={() => setIsEditing(false)}
//           post={selectedPost}
//           onSave={async (updatedPost) => {
//             // Update the post in the state
//             setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)))
//             setIsEditing(false)
//           }}
//         />
//       )}

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Delete Post</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete this post? This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setPostToDelete(null)}>
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={handleDeletePost} disabled={isDeleting}>
//               {isDeleting ? (
//                 <>
//                   <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                   Deleting...
//                 </>
//               ) : (
//                 "Delete"
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }




"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Loader2, RefreshCw, Calendar, Package, Edit, Trash2, ImageIcon, ArrowLeft, CreditCard } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
  const [userCredits, setUserCredits] = useState(0)

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

      // Fetch user credits
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", session.user.id)
        .single()

      if (profileData) {
        console.log("Client: Fetched user credits:", profileData.credits)
        setUserCredits(profileData.credits || 0)
      }

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

    // Credit check is now handled on the server
    console.log(`Client: Generating ${numberOfAds} posts with ${userCredits} credits available`)

    setIsGenerating(true)
    setError(null)
    setSuccess(null)

    // Call the server action to generate posts and handle credits
    const result = await generatePosts(selectedBrandKit, numberOfAds)
    console.log("Client: Generation result:", result)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.success)
      setPosts(result.data as Post[])

      // Update local credit state if server returned new balance
      if (result.creditsRemaining !== undefined) {
        console.log(`Client: Updating credits to ${result.creditsRemaining}`)
        setUserCredits(result.creditsRemaining)
      }
    }

    setIsGenerating(false)

    // Refresh user credits from database to ensure UI is in sync
    const supabase = createClient()
    const { data: profileData } = await supabase.from("profiles").select("credits").single()

    if (profileData) {
      console.log(`Client: Refreshed credits from DB: ${profileData.credits}`)
      setUserCredits(profileData.credits || 0)
    }
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
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8 mr-1">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Instagram Posts</h1>
          <Badge variant="outline" className="ml-2 bg-primary/5 text-primary">
            AI Generated
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Create and manage Instagram posts for your brand</p>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{userCredits} credits remaining</span>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="mb-8 rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="brand-kit" className="text-sm font-medium">
                Brand Kit
              </label>
              {brandKits.length > 0 ? (
                <Select value={selectedBrandKit} onValueChange={handleBrandKitChange}>
                  <SelectTrigger id="brand-kit" className="w-full sm:w-[240px]">
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
                <Link href="/brand-kit" className=" ml-0 lg:ml-10 md:ml-10">
                  <Button variant="outline" className="w-full sm:w-auto ml-0 lg:ml-10 md:ml-10">
                    Create Brand Kit
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {brandKits.length > 0 && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="space-y-2">
                <label htmlFor="num-posts" className="text-sm font-medium">
                  Number of Posts
                </label>
                <Input
                  id="num-posts"
                  type="number"
                  min="1"
                  value={numberOfAds}
                  onChange={(e) => setNumberOfAds(Number.parseInt(e.target.value) || 1)}
                  className="w-full sm:w-24"
                />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        size="default"
                        onClick={handleGeneratePosts}
                        disabled={isGenerating || !selectedBrandKit || userCredits < numberOfAds}
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
                            Generate Posts ({numberOfAds} credits)
                          </>
                        )}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {userCredits < numberOfAds && (
                    <TooltipContent>
                      <p>
                        Not enough credits. You need {numberOfAds} credits but only have {userCredits}.
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="mb-6 animate-in fade-in slide-in-from-top-5 duration-300">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-500 bg-green-50 animate-in fade-in slide-in-from-top-5 duration-300">
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      {posts.length > 0 && (
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
      )}

      {/* Content Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="overflow-hidden border border-border/50">
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
        <div className="animate-in fade-in duration-500">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="group overflow-hidden border border-border/50 bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:translate-y-[-4px]"
              >
                <CardContent className="p-0 relative">
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    <Image
                      src={post.image_url || "/placeholder.svg"}
                      alt={`Instagram post`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div className="flex w-full gap-2">
                        <Button size="sm" variant="default" className="flex-1 " onClick={() => openPostEditor(post)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => confirmDeletePost(post.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4">
                  <div className="space-y-2 w-full">
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.caption}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        Instagram
                      </Badge>
                      <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center animate-in fade-in duration-500">
          <div className="mb-6 rounded-full bg-primary/10 p-4">
            <ImageIcon className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">No posts generated yet</h3>
          <p className="mb-6 text-muted-foreground max-w-md">
            {brandKits.length > 0
              ? "Click the button below to generate Instagram posts for your brand"
              : "Create a brand kit first to generate Instagram posts"}
          </p>
          {brandKits.length > 0 ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      onClick={handleGeneratePosts}
                      disabled={isGenerating || userCredits < numberOfAds}
                      size="lg"
                      className="gap-2"
                    >
                      {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                      Generate Posts ({numberOfAds} credits)
                    </Button>
                  </div>
                </TooltipTrigger>
                {userCredits < numberOfAds && (
                  <TooltipContent>
                    <p>
                      Not enough credits. You need {numberOfAds} credits but only have {userCredits}.
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
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
