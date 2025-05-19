"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TweetCard } from "@/components/social/TweetCard"
import { Loader2, Sparkles, Palette, Type, Plus, Trash2, ArrowLeft, ImageIcon, X, Send } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { getBrandKits } from "@/lib/actions/brand-kits"
import { createClient } from "@/lib/supabase/client"

// Constants for dropdown options
const TWEET_TYPES = [
  { label: "Standard", value: "standard" },
  { label: "Thread", value: "thread" }, // Enabled thread option
  { label: "Poll", value: "poll", disabled: true },
  { label: "Quote", value: "quote", disabled: true },
]

const STYLES = ["Professional", "Casual", "Humorous", "Informative", "Persuasive"]
const MOODS = ["Neutral", "Excited", "Curious", "Thoughtful", "Urgent"]

// Thread length options
const THREAD_LENGTHS = [2, 3, 4, 5]

// Interface for a single tweet in a thread
interface TweetItem {
  id: string
  content: string
}

// Type guard for brand kit
function isValidBrandKit(obj: any): obj is { id: string; name: string } {
  return obj && typeof obj === 'object' && typeof obj.id === 'string' && typeof obj.name === 'string';
}

// Type guard for post
function isValidPost(obj: any): obj is { id: string; tweet_post: string | null; tweet_thread: string | null } {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    'tweet_post' in obj &&
    'tweet_thread' in obj
  );
}

export default function TwitterPostsPage() {
  // For single tweet mode
  const [tweet, setTweet] = useState("")

  // For image upload
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // For thread mode
  const [tweetThread, setTweetThread] = useState<TweetItem[]>([{ id: "1", content: "" }])

  // Suggestions can be a single string or an array of strings
  const [suggestion, setSuggestion] = useState<string | string[]>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [threadLength, setThreadLength] = useState(3)

  // Text area state
  const [textareaFocused, setTextareaFocused] = useState(false)

  // UI state variables
  const [selectedBrandKit, setSelectedBrandKit] = useState("")
  const [tweetType, setTweetType] = useState("standard")
  const [style, setStyle] = useState("Professional")
  const [mood, setMood] = useState("Neutral")

  // Real brand kits from Supabase
  const [brandKits, setBrandKits] = useState<any[]>([])

  // User/session state
  const [userId, setUserId] = useState<string | null>(null)
  // Posts state
  const [posts, setPosts] = useState<any[]>([])

  // State for deleting
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  // Fetch user and posts on mount, restoring selectedBrandKit from localStorage if possible
  useEffect(() => {
    async function fetchUserAndPosts() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) setUserId(session.user.id);
      // Fetch brand kits as before
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
          .eq('platform', 'twitter' as any)
          .order('created_at', { ascending: false });
        setPosts(fetchedPosts || []);
      }
    }
    fetchUserAndPosts();
  }, []);

  // Fetch posts when selectedBrandKit or userId changes
  useEffect(() => {
    async function fetchPostsForBrandKit() {
      if (!userId || !selectedBrandKit) return;
      const supabase = createClient();
      const { data: fetchedPosts } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId as any)
        .eq('brand_kit_id', selectedBrandKit as any)
        .eq('platform', 'twitter' as any)
        .order('created_at', { ascending: false });
      setPosts(fetchedPosts || []);
    }
    fetchPostsForBrandKit();
  }, [selectedBrandKit, userId]);

  // Only use valid brand kits (with string id) in the render scope
  const validBrandKits = Array.isArray(brandKits) ? brandKits.filter(isValidBrandKit) : [];

  // Get the brand name for the selected brand kit
  const selectedBrand = brandKits.find((bk) => bk.id === selectedBrandKit);
  const brandName = selectedBrand?.name || "Brand";
  const brandLogo = selectedBrand?.logo_url || "/default-avatar.png";

  // Handle tweet type change
  const handleTweetTypeChange = (type: string) => {
    setTweetType(type)
    // Reset suggestions when switching modes
    setSuggestion("")

    // Initialize thread with first tweet content if switching to thread mode
    if (type === "thread" && tweet) {
      setTweetThread([{ id: "1", content: tweet }])
    }
  }

  // Update a specific tweet in the thread
  const updateThreadTweet = (id: string, content: string) => {
    setTweetThread((prev) => prev.map((item) => (item.id === id ? { ...item, content } : item)))
  }

  // Add a new tweet to the thread
  const addThreadTweet = () => {
    const newId = (tweetThread.length + 1).toString()
    setTweetThread((prev) => [...prev, { id: newId, content: "" }])
  }

  // Remove a tweet from the thread
  const removeThreadTweet = (id: string) => {
    if (tweetThread.length > 1) {
      setTweetThread((prev) => prev.filter((item) => item.id !== id))
    }
  }

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

  // Generate tweet or thread based on current mode
  async function handleGenerate() {
    setLoading(true)
    setError(null)

    try {
      const payload = {
        user: { full_name: "Demo User" },
        brandKit: selectedBrandKit,
        style,
        mood,
        tweetType,
        hasImage: !!imagePreview,
      }

      // Add appropriate content based on tweet type
      if (tweetType === "standard") {
        Object.assign(payload, { context: tweet })
      } else if (tweetType === "thread") {
        // For thread, send the first tweet as context, thread length, and all tweet contents as existingThread
        Object.assign(payload, {
          context: tweetThread[0].content,
          threadLength: threadLength,
          existingThread: tweetThread.map((t) => t.content),
        })
      }

      const res = await fetch("/api/generate-tweet", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()

      // Handle different response formats based on tweet type
      if (tweetType === "standard") {
        setSuggestion(data.tweet)
      } else if (tweetType === "thread") {
        // Expect an array of tweets for thread
        setSuggestion(data.tweets || [data.tweet])
      }
    } catch (e) {
      setError("Failed to generate tweet. Please try again.")
    }

    setLoading(false)
  }

  // Placeholder: get the postId for the current post (replace with your actual logic)
  const postId = "REPLACE_WITH_CURRENT_POST_ID";

  // Save to Supabase when accepting a suggestion (insert new post)
  async function saveToSupabase({ tweetText, threadArray }: { tweetText?: string, threadArray?: string[] }) {
    if (!userId || !selectedBrandKit) return;
    let imageUrl = "";
    if (imagePreview && imagePreview.startsWith("data:image/")) {
      // Upload to R2 via API route
      const res = await fetch("/api/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUrl: imagePreview, userId }),
      });
      const data = await res.json();
      if (data.url) imageUrl = data.url;
    }
    const supabase = createClient();
    let insertObj: any = {
      user_id: userId,
      brand_kit_id: selectedBrandKit,
      caption: tweetText || (threadArray ? threadArray[0] : ""),
      image_url: imageUrl,
      status: "draft",
      type: "text",
      platform: "twitter",
      tweet_post: tweetText || null,
      tweet_thread: threadArray ? JSON.stringify(threadArray) : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { data: postData, error } = await supabase.from('posts').insert([insertObj]).select().single();
    if (error) {
      setError('Failed to save tweet(s) to Supabase.');
    } else {
      setPosts((prev) => [postData, ...prev]);
    }
  }

  async function handleAccept() {
    if (tweetType === "standard" && typeof suggestion === "string") {
      setTweet(suggestion)
      await saveToSupabase({ tweetText: suggestion })
    } else if (tweetType === "thread" && Array.isArray(suggestion)) {
      // Create new thread items from suggestions
      const newThread = suggestion.map((content, index) => ({
        id: (index + 1).toString(),
        content,
      }))
      setTweetThread(newThread)
      await saveToSupabase({ threadArray: suggestion })
    }
    setSuggestion("")
  }

  // Clear the current tweet or thread
  function handleClear() {
    if (tweetType === "standard") {
      setTweet("")
    } else {
      setTweetThread([{ id: "1", content: "" }])
    }
    setSuggestion("")
    setImagePreview(null)
  }

  // Delete post from Supabase and local state
  async function handleDeletePost(postId: string) {
    if (!postId) return;
    if (!window.confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
    setDeletingPostId(postId);
    const supabase = createClient();
    const { error } = await supabase.from('posts').delete().eq('id', postId as any);
    if (error) {
      setError('Failed to delete post.');
    } else {
      setPosts((prev: any[]) => prev.filter((p) => p.id !== postId));
    }
    setDeletingPostId(null);
  }

  return (
    <div className="min-h-screen pb-32 sm:pb-40 bg-[#f7f9fa]">
      {/* Header Section (from image-posts) */}
      <div className="container mx-auto px-4 pt-5 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8 mr-1">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Twitter Posts</h1>
          <Badge variant="outline" className="ml-2 bg-primary/5 text-primary">
            AI Generated
          </Badge>
        </div>
        <p className="text-muted-foreground mb-2">
          {tweetType === "standard"
            ? "Craft your next viral post with AI"
            : "Create engaging tweet threads with AI assistance"}
        </p>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto p-4">
        {/* Fetched Twitter Posts */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Your Twitter Posts</h2>
          {posts.filter(isValidPost).map((post) => (
            <Card key={post.id} className="mb-4 p-4 border border-gray-200/70 bg-white/80 shadow-sm relative">
              {/* Delete button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 text-red-500 hover:text-red-700"
                onClick={() => handleDeletePost(post.id)}
                disabled={deletingPostId === post.id}
                title="Delete post"
              >
                {deletingPostId === post.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
              {post.tweet_post && (
                <TweetCard
                  post={{ caption: post.tweet_post, image_url: post.image_url }}
                  user={{ full_name: brandName, username: brandName.replace(/\s+/g, '').toLowerCase(), avatar_url: brandLogo }}
                />
              )}
              {post.tweet_thread && (
                <div className="space-y-1">
                  {JSON.parse(post.tweet_thread).map((tweet: string, idx: number) => (
                    <TweetCard
                      key={idx}
                      post={{ caption: tweet, image_url: post.image_url }}
                      user={{ full_name: brandName, username: brandName.replace(/\s+/g, '').toLowerCase(), avatar_url: brandLogo }}
                    />
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
        {/* Thread Controls - Only show when in thread mode */}
        {tweetType === "thread" && (
          <Card className="mb-4 p-4 flex items-center justify-between border border-gray-200/70 bg-white/80 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Thread Length:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    {threadLength} tweets
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {THREAD_LENGTHS.map((length) => (
                    <DropdownMenuItem key={length} onSelect={() => setThreadLength(length)}>
                      {length} tweets
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={addThreadTweet}
              className="flex items-center gap-1"
              disabled={tweetThread.length >= 5}
            >
              <Plus className="h-4 w-4" /> Add Tweet
            </Button>
          </Card>
        )}

        {/* Live Preview */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Live Preview</h2>
          <Card className="p-4 border border-gray-200/70 bg-white/80 shadow-sm">
            {tweetType === "standard" ? (
              // Single tweet preview
              <TweetCard
                post={{
                  caption: tweet || "Your tweet will appear here",
                  image_url: imagePreview || undefined,
                }}
                user={{ full_name: brandName, username: brandName.replace(/\s+/g, '').toLowerCase(), avatar_url: brandLogo }}
              />
            ) : (
              // Thread preview
              <div className="space-y-1">
                {tweetThread.map((tweetItem, index) => (
                  <div key={tweetItem.id} className="relative">
                    {index > 0 && <div className="absolute left-5 top-0 w-0.5 h-4 bg-gray-200 -mt-1"></div>}
                    <TweetCard
                      post={{
                        caption: tweetItem.content || `Tweet ${index + 1} will appear here`,
                        image_url: index === 0 ? imagePreview || undefined : undefined,
                      }}
                      user={{ full_name: brandName, username: brandName.replace(/\s+/g, '').toLowerCase(), avatar_url: brandLogo }}
                    />
                    {index < tweetThread.length - 1 && (
                      <div className="absolute left-5 bottom-0 w-0.5 h-4 bg-gray-200 -mb-1"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
            <Card className="border border-primary/20 bg-primary/5 p-4 shadow-sm">
              {tweetType === "standard" && typeof suggestion === "string" ? (
                // Single tweet suggestion
                <TweetCard
                  post={{
                    caption: suggestion,
                    image_url: imagePreview || undefined,
                  }}
                  user={{ full_name: brandName, username: brandName.replace(/\s+/g, '').toLowerCase(), avatar_url: brandLogo }}
                />
              ) : (
                Array.isArray(suggestion) && (
                  // Thread suggestion
                  <div className="space-y-1">
                    {suggestion.map((tweetContent, index) => (
                      <div key={index} className="relative">
                        {index > 0 && <div className="absolute left-5 top-0 w-0.5 h-4 bg-gray-200 -mt-1"></div>}
                        <TweetCard
                          post={{
                            caption: tweetContent,
                            image_url: index === 0 ? imagePreview || undefined : undefined,
                          }}
                          user={{ full_name: brandName, username: brandName.replace(/\s+/g, '').toLowerCase(), avatar_url: brandLogo }}
                        />
                        {index < suggestion.length - 1 && (
                          <div className="absolute left-5 bottom-0 w-0.5 h-4 bg-gray-200 -mb-1"></div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}
            </Card>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <Card className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-600 shadow-sm">{error}</Card>
        )}

        {/* Thread Editor - Only show in thread mode */}
        {tweetType === "thread" && (
          <div className="mb-6 space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground">Thread Editor</h2>
            {tweetThread.map((tweetItem, index) => (
              <Card
                key={tweetItem.id}
                className="flex gap-2 items-start p-3 border border-gray-200/70 bg-white/80 shadow-sm"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <Textarea
                    value={tweetItem.content}
                    onChange={(e) => updateThreadTweet(tweetItem.id, e.target.value)}
                    placeholder={`Tweet ${index + 1}`}
                    className="resize-none"
                    rows={2}
                  />
                  <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                    <span className={tweetItem.content.length > 260 ? "text-red-500" : ""}>
                      {tweetItem.content.length}/280
                    </span>
                    {tweetThread.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeThreadTweet(tweetItem.id)}
                        className="h-6 px-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Hidden file input for image upload */}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

      {/* Bottom Creation Toolbar - Redesigned for better visibility and usability */}
      <div className="fixed bottom-0 bg-white/70 backdrop-blur-lg border rounded-t-lg sm:rounded-lg border-gray-200/50   mx-auto left-0 right-0 max-w-2xl z-50 px-2 pb-2 sm:pb-4 sm:left-[250px] sm:right-0 sm:bottom-4 sm:px-0">
        <div className="max-w-2xl mx-auto px-4 mt-3 left-[120px]">
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

            {/* Tweet Type Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 rounded-full text-xs bg-white/40 backdrop-blur-sm min-w-[90px] px-2 h-8"
                >
                  <Type className="w-4 h-4" />
                  <span className="truncate">
                    {TWEET_TYPES.find((t) => t.value === tweetType)?.label || "Regular Tweet"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {TWEET_TYPES.map((type) => (
                  <DropdownMenuItem
                    key={type.value}
                    onSelect={() => handleTweetTypeChange(type.value)}
                    disabled={type.disabled === true}
                  >
                    {type.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Style Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 rounded-full text-xs bg-white/40 backdrop-blur-sm min-w-[90px] px-2 h-8"
                >
                  <Palette className="w-4 h-4" />
                  <span className="truncate">{style}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {STYLES.map((s) => (
                  <DropdownMenuItem key={s} onSelect={() => setStyle(s)}>
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mood Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 rounded-full text-xs bg-white/40 backdrop-blur-sm min-w-[90px] px-2 h-8"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="truncate">{mood}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {MOODS.map((m) => (
                  <DropdownMenuItem key={m} onSelect={() => setMood(m)}>
                    {m}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Image preview area (if image is uploaded) */}
          

          {/* Text input area with buttons */}
          <div className="flex flex-col">
            <div className="relative">
              <Textarea
                value={tweetType === "standard" ? tweet : tweetThread[0].content}
                onChange={(e) => {
                  if (tweetType === "standard") setTweet(e.target.value)
                  else updateThreadTweet(tweetThread[0].id, e.target.value)
                }}
                onFocus={() => setTextareaFocused(true)}
                onBlur={() => setTextareaFocused(false)}
                maxLength={280}
                rows={textareaFocused ? 3 : 2}
                className="w-full px-3 py-2 text-base border rounded-lg border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary bg-white resize-none"
                placeholder="What's happening?"
              />

              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                <span
                  className={`text-xs ${
                    (tweetType === "standard" ? tweet.length : tweetThread[0].content.length) > 260
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {tweetType === "standard" ? tweet.length : tweetThread[0].content.length}/280
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 rounded-full p-0 border border-gray-200 "
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-5 w-5 " />
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
                        disabled={loading || (tweetType === "standard" ? !tweet : !tweetThread[0].content)}
                        className="flex items-center gap-2 rounded-full h-9 px-4 bg-primary text-white"
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        {loading ? "Generating..." : "AI Suggestion"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Generate an AI-powered tweet suggestion{tweetType === "thread" ? " for your thread" : ""}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  variant="default"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={tweetType === "standard" ? !tweet : !tweetThread[0].content}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
