"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Loader2,
  Sparkles,
  Briefcase,
  Type,
  ImageIcon,
  X,
  Send,
  ArrowLeft,
  Calendar,
  Hash,
  Globe,
  Users,
  Bookmark,
  ChevronDown,
  ChevronUp,
  FileText,
  BarChart2,
  ThumbsUp,
  MessageSquare,
  Share2,
  Palette,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { getBrandKits } from "@/lib/actions/brand-kits"

// Mock component for LinkedIn post card
function LinkedInPostCard({ post, user }: { post: any; user: any }) {
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

// Constants for dropdown options
const POST_TYPES = [
  { label: "Standard", value: "standard" },
  { label: "Article", value: "article" },
  { label: "Poll", value: "poll", disabled: true },
  { label: "Document", value: "document", disabled: true },
]

const TONES = ["Professional", "Conversational", "Inspirational", "Educational", "Thought Leadership"]

const INDUSTRIES = [
  "Technology",
  "Marketing",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Manufacturing",
  "Consulting",
]

const SUGGESTED_HASHTAGS = [
  "#LinkedInTips",
  "#CareerAdvice",
  "#Leadership",
  "#Innovation",
  "#ProfessionalDevelopment",
  "#WorkLifeBalance",
  "#Networking",
  "#JobSearch",
  "#RemoteWork",
  "#BusinessStrategy",
]

// Type guard for brand kit
function isValidBrandKit(obj: any): obj is { id: string; name: string } {
  return obj && typeof obj === 'object' && typeof obj.id === 'string' && typeof obj.name === 'string';
}
// Type guard for post
function isValidPost(obj: any): obj is { id: string; caption: string; image_url: string; linkedin_post?: string | null; linkedin_article?: string | null } {
  return (
    obj && typeof obj === 'object' && typeof obj.id === 'string' && 'caption' in obj && 'image_url' in obj
  );
}

export default function LinkedInPostsPage() {
  // State for post content
  const [post, setPost] = useState("")
  const [postTitle, setPostTitle] = useState("")
  const [suggestion, setSuggestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // State for UI controls
  const [postType, setPostType] = useState("standard")
  const [tone, setTone] = useState("Professional")
  const [industry, setIndustry] = useState("")
  const [textareaFocused, setTextareaFocused] = useState(false)
  const [activeTab, setActiveTab] = useState("compose")
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [formalityLevel, setFormalityLevel] = useState(70)
  const [includeHashtags, setIncludeHashtags] = useState(true)
  const [scheduledTime, setScheduledTime] = useState<string | null>(null)
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([])

  // Image upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch user, credits, brand kits, and posts on mount
  const [userId, setUserId] = useState<string | null>(null)
  const [userCredits, setUserCredits] = useState<number>(0)
  const [brandKits, setBrandKits] = useState<any[]>([])
  const [selectedBrandKit, setSelectedBrandKit] = useState("")
  const [posts, setPosts] = useState<any[]>([])

  // Fetch user, credits, brand kits, and posts on mount
  useEffect(() => {
    async function fetchUserAndPosts() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) setUserId(session.user.id);
      // Fetch user credits
      if (session?.user?.id) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", session.user.id as any)
          .single();
        setUserCredits(profileData && 'credits' in profileData ? profileData.credits || 0 : 0);
      }
      // Fetch brand kits
      const kits = await getBrandKits();
      setBrandKits(kits);
      const firstValid = Array.isArray(kits) ? kits.find(isValidBrandKit) : null;
      // Restore from localStorage if possible
      let storedBrandKitId: string | null = null;
      if (typeof window !== "undefined") {
        storedBrandKitId = localStorage.getItem("selectedBrandKitId");
      }
      const validStored = kits.find((k: any) => k.id === storedBrandKitId);
      if (validStored && isValidBrandKit(validStored)) {
        setSelectedBrandKit(validStored.id);
      } else if (firstValid && isValidBrandKit(firstValid)) {
        setSelectedBrandKit(firstValid.id);
      }
      // Fetch posts for this user/brand kit
      const brandKitIdToUse = validStored && isValidBrandKit(validStored) ? validStored.id : (firstValid && isValidBrandKit(firstValid) ? firstValid.id : null);
      if (session?.user?.id && brandKitIdToUse) {
        const { data: fetchedPosts } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', session.user.id as any)
          .eq('brand_kit_id', brandKitIdToUse as any)
          .eq('platform', 'linkedin' as any)
          .order('created_at', { ascending: false });
        setPosts(fetchedPosts || []);
      }
    }
    fetchUserAndPosts();
  }, []);

  // Fetch LinkedIn posts and articles separately
  useEffect(() => {
    async function fetchPostsForBrandKit() {
      if (!userId || !selectedBrandKit) return;
      const supabase = createClient();
      // Fetch regular posts
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId as any)
        .eq('brand_kit_id', selectedBrandKit as any)
        .eq('platform', 'linkedin' as any)
        .not('linkedin_post', 'is', null)
        .order('created_at', { ascending: false });
      // Fetch articles
      const { data: articlesData } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId as any)
        .eq('brand_kit_id', selectedBrandKit as any)
        .eq('platform', 'linkedin' as any)
        .not('linkedin_article', 'is', null)
        .order('created_at', { ascending: false });
      setPosts([
        ...(postsData || []),
        ...(articlesData || [])
      ]);
    }
    fetchPostsForBrandKit();
  }, [selectedBrandKit, userId]);

  // Only use valid brand kits (with string id) in the render scope
  const validBrandKits = Array.isArray(brandKits) ? brandKits.filter(isValidBrandKit) : [];
  // Get the brand name for the selected brand kit
  const selectedBrand = brandKits.find((bk) => bk.id === selectedBrandKit);
  const brandName = selectedBrand?.name || "Brand";
  const brandLogo = selectedBrand?.logo_url || "/default-avatar.png";

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove uploaded image
  const removeImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Add or remove hashtag
  const toggleHashtag = (hashtag: string) => {
    if (selectedHashtags.includes(hashtag)) {
      setSelectedHashtags(selectedHashtags.filter((h) => h !== hashtag))
    } else {
      setSelectedHashtags([...selectedHashtags, hashtag])
    }
  }

  // Generate LinkedIn post
  async function handleGenerate() {
    setLoading(true)
    setError(null)
    // Require 2 credits for article, 1 for standard
    const requiredCredits = postType === "article" ? 2 : 1;
    if (userCredits < requiredCredits) {
      setError(`Not enough credits. You need ${requiredCredits} credit${requiredCredits > 1 ? 's' : ''} but only have ${userCredits}.`);
      setLoading(false);
      return;
    }
    try {
      // Deduct credits in Supabase
      const supabase = createClient();
      if (userId) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", userId as any)
          .single();
        const currentCredits = profileData && 'credits' in profileData ? profileData.credits || 0 : 0;
        if (currentCredits < requiredCredits) {
          setError(`Not enough credits. You need ${requiredCredits} credit${requiredCredits > 1 ? 's' : ''} but only have ${currentCredits}.`);
          setLoading(false);
          return;
        }
        const newCredits = currentCredits - requiredCredits;
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ credits: newCredits } as any)
          .eq("id", userId as any);
        if (updateError) {
          setError("Failed to update your credits. Please try again.");
          setLoading(false);
          return;
        }
        setUserCredits(newCredits);
      }
      // Prepare payload for AI
      const selectedBrandKitObj = brandKits.find((bk) => bk.id === selectedBrandKit);
      const payload = {
        topic: post,
        title: postTitle,
        postType,
        tone,
        industry,
        formalityLevel,
        includeHashtags,
        hasImage: !!imagePreview,
        selectedHashtags,
        brandKit: selectedBrandKitObj,
      }
      const res = await fetch("/api/generate-linkedin-post", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      })
      const data = await res.json()
      setSuggestion(data.suggestion)
      if (data.hashtags && includeHashtags) {
        setSelectedHashtags(data.hashtags.slice(0, 5))
      }
    } catch (e) {
      setError("Failed to generate LinkedIn post. Please try again.")
    }
    setLoading(false)
  }

  // Save to Supabase when accepting a suggestion
  async function saveToSupabase({ caption }: { caption: string }) {
    if (!userId || !selectedBrandKit) return;
    let imageUrl = "";
    if (imagePreview && imagePreview.startsWith("data:image/")) {
      // Upload to Cloudflare via API
      const res = await fetch("/api/tweet-image-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUrl: imagePreview, userId }),
      });
      const data = await res.json();
      imageUrl = data.url || "";
    } else if (imagePreview) {
      imageUrl = imagePreview;
    }
    const supabase = createClient();
    let insertObj: any = {
      user_id: userId,
      brand_kit_id: selectedBrandKit,
      caption: caption,
      image_url: imageUrl,
      status: "draft",
      type: postType, // 'standard' or 'article'
      platform: "linkedin",
      linkedin_post: postType === "article" ? null : caption,
      linkedin_article: postType === "article" ? caption : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { data: postData, error } = await supabase.from('posts').insert([insertObj]).select().single();
    if (error) {
      setError('Failed to save post to Supabase.');
    } else {
      setPosts((prev) => [postData, ...prev]);
    }
  }

  // Accept AI suggestion
  async function handleAccept() {
    setPost(suggestion)
    await saveToSupabase({ caption: suggestion })
    setSuggestion("")
  }

  // Clear post content
  function handleClear() {
    setPost("")
    setPostTitle("")
    setImagePreview(null)
    setSelectedHashtags([])
  }

  // Add delete post functionality
  async function handleDeletePost(postId: string) {
    if (!postId) return;
    if (!window.confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
    const supabase = createClient();
    const { error } = await supabase.from('posts').delete().eq('id', postId as any);
    if (error) {
      setError('Failed to delete post.');
    } else {
      setPosts((prev: any[]) => prev.filter((p) => p.id !== postId));
    }
  }

  return (
    <div className="min-h-screen pb-32 sm:pb-40 bg-[#f3f6fa]">
      {/* Header Section */}
      <div className="container mx-auto px-4 pt-5 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8 mr-1">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">LinkedIn Posts</h1>
          <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-600 border-blue-200">
            AI Generated
          </Badge>
        </div>
        <p className="text-muted-foreground mb-2">
          Create professional LinkedIn content that drives engagement and builds your personal brand
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            {userCredits} Credits
          </Badge>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto p-4">
        {/* Fetched LinkedIn Posts */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Your LinkedIn Posts</h2>
          {posts.filter(isValidPost).map((post) => (
            <Card key={post.id} className="mb-4 p-4 border border-gray-200/70 bg-white/80 shadow-sm relative">
              {/* Delete button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 text-red-500 hover:text-red-700"
                onClick={() => handleDeletePost(post.id)}
                title="Delete post"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 mb-2">
                {post.linkedin_article && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Article</Badge>}
                {post.linkedin_post && <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Post</Badge>}
              </div>
              <LinkedInPostCard
                post={{
                  caption: post.linkedin_article || post.linkedin_post,
                  image_url: post.image_url,
                }}
                user={{
                  full_name: brandName,
                  headline: brandName,
                  avatar_url: brandLogo,
                }}
              />,
            </Card>
          ))}
        </div>

        {/* Live Preview */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Live Preview</h2>
          <Card className="p-4 border border-gray-200/70 bg-white/80 shadow-sm">
            <LinkedInPostCard
              post={{
                caption: post,
                image_url: imagePreview || undefined,
              }}
              user={{
                full_name: brandName,
                headline: postType === "article" ? postTitle || "Article Title" : brandName,
                avatar_url: brandLogo,
              }}
            />
          </Card>
        </div>

        {/* AI Suggestion (if available) */}
        {suggestion && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-muted-foreground">AI Suggestion</h2>
              <Button size="sm" variant="outline" onClick={handleAccept}>
                Accept Suggestion
              </Button>
            </div>
            <Card className="border border-blue-100 bg-blue-50/50 p-4 shadow-sm">
              <LinkedInPostCard
                post={{
                  caption: suggestion,
                  image_url: imagePreview || undefined,
                }}
                user={{
                  full_name: brandName,
                  headline: postType === "article" ? postTitle || "Article Title" : brandName,
                  avatar_url: brandLogo,
                }}
              />
            </Card>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <Card className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-600 shadow-sm">{error}</Card>
        )}
      </div>

      {/* Bottom Creation Toolbar - Redesigned for better visibility and usability */}
      <div className="fixed bottom-0 bg-white/70 backdrop-blur-lg border rounded-t-lg sm:rounded-lg border-gray-200/50 mx-auto left-0 right-0 max-w-2xl z-50 px-2 pb-2 sm:pb-4 sm:left-[250px] sm:right-0 sm:bottom-4 sm:px-0">
        <div className="max-w-2xl mx-auto px-4 mt-3">
          {/* Top row with dropdowns */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {/* Brand Kit Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 rounded-full text-xs bg-white/40 backdrop-blur-sm min-w-[90px] px-2 h-8"
                >
                  <Palette className="w-4 h-4" />
                  <span className="truncate">
                    {validBrandKits.find((bk) => bk.id === selectedBrandKit)?.name || "Brand Kit"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {validBrandKits.length > 0 ? (
                  validBrandKits.map((brandKit) => (
                    <DropdownMenuItem key={brandKit.id} onSelect={() => {
                      setSelectedBrandKit(brandKit.id);
                      if (typeof window !== "undefined") {
                        localStorage.setItem("selectedBrandKitId", brandKit.id);
                      }
                    }}>
                      {brandKit.name}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/brand-kit">Create Brand Kit</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Post Type Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 rounded-full text-xs bg-white/40 backdrop-blur-sm min-w-[90px] px-2 h-8"
                >
                  <Type className="w-4 h-4" />
                  <span className="truncate">{POST_TYPES.find((t) => t.value === postType)?.label || "Standard"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {POST_TYPES.map((type) => (
                  <DropdownMenuItem
                    key={type.value}
                    onSelect={() => setPostType(type.value)}
                    disabled={type.disabled === true}
                  >
                    {type.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tone Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 rounded-full text-xs bg-white/40 backdrop-blur-sm min-w-[90px] px-2 h-8"
                >
                  <Briefcase className="w-4 h-4" />
                  <span className="truncate">{tone}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {TONES.map((t) => (
                  <DropdownMenuItem key={t} onSelect={() => setTone(t)}>
                    {t}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Industry Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 rounded-full text-xs bg-white/40 backdrop-blur-sm min-w-[90px] px-2 h-8"
                >
                  <Users className="w-4 h-4" />
                  <span className="truncate">{industry || "Industry"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {INDUSTRIES.map((ind) => (
                  <DropdownMenuItem key={ind} onSelect={() => setIndustry(ind)}>
                    {ind}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Hashtag Toggle Button */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 rounded-full text-xs bg-white/40 backdrop-blur-sm min-w-[90px] px-2 h-8"
              onClick={() => setIncludeHashtags(!includeHashtags)}
            >
              <Hash className="w-4 h-4" />
              <span className="truncate">Hashtags: {includeHashtags ? "On" : "Off"}</span>
            </Button>
          </div>

          {/* Hashtag selection UI */}
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedHashtags.map((hashtag) => (
              <Badge
                key={hashtag}
                variant="secondary"
                className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer flex items-center gap-1"
                onClick={() => setSelectedHashtags(selectedHashtags.filter((h) => h !== hashtag))}
              >
                {hashtag}
                <X className="h-3 w-3" />
              </Badge>
            ))}
            {selectedHashtags.length === 0 && <span className="text-sm text-gray-400">No hashtags selected</span>}
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {SUGGESTED_HASHTAGS.map((hashtag) => (
              <Badge
                key={hashtag}
                variant="outline"
                className={`cursor-pointer ${selectedHashtags.includes(hashtag) ? "bg-blue-100 text-blue-700 border-blue-200" : ""}`}
                onClick={() => {
                  if (selectedHashtags.includes(hashtag)) {
                    setSelectedHashtags(selectedHashtags.filter((h) => h !== hashtag))
                  } else {
                    setSelectedHashtags([...selectedHashtags, hashtag])
                  }
                }}
              >
                {hashtag}
              </Badge>
            ))}
          </div>

          {/* Image preview area (if image is uploaded) */}
          {imagePreview && (
            <div className="mb-3 relative">
              <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                <img src={imagePreview || "/placeholder.svg"} alt="Post image" className="w-full h-full object-cover" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 rounded-full"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Text input area with buttons */}
          <div className="flex flex-col">
            <div className="relative">
              <Textarea
                value={post}
                onChange={(e) => setPost(e.target.value)}
                onFocus={() => setTextareaFocused(true)}
                onBlur={() => setTextareaFocused(false)}
                maxLength={1300}
                rows={textareaFocused ? 4 : 3}
                className="w-full px-3 py-2 text-base border rounded-lg border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white resize-none"
                placeholder="Share your thoughts, insights, or updates..."
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                <span className={`text-xs ${post.length > 1200 ? "text-red-500" : "text-gray-400"}`}>{post.length}/1300</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 rounded-full p-0 border border-gray-200"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-5 w-5 text-blue-600" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClear} className="h-9 px-3 text-gray-500">
                  Clear
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleGenerate}
                        disabled={loading || !post || userCredits < (postType === "article" ? 2 : 1)}
                        className="flex items-center gap-2 rounded-full h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        {loading ? "Generating..." : `AI Suggestion (${postType === "article" ? 2 : 1} credit${postType === "article" ? 's' : ''})`}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Generate an AI-powered LinkedIn post</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input for image upload */}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
    </div>
  )
}
