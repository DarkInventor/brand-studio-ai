"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TweetCard } from "@/components/social/TweetCard"
import { Loader2, Sparkles, Palette, Type, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

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

export default function TwitterPostsPage() {
  // For single tweet mode
  const [tweet, setTweet] = useState("")

  // For thread mode
  const [tweetThread, setTweetThread] = useState<TweetItem[]>([{ id: "1", content: "" }])

  // Suggestions can be a single string or an array of strings
  const [suggestion, setSuggestion] = useState<string | string[]>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [threadLength, setThreadLength] = useState(3)

  // UI state variables
  const [selectedBrandKit, setSelectedBrandKit] = useState("")
  const [tweetType, setTweetType] = useState("standard")
  const [style, setStyle] = useState("Professional")
  const [mood, setMood] = useState("Neutral")

  // Mock brand kits for demo
  const validBrandKits = [
    { id: "personal", name: "Personal" },
    { id: "business", name: "Business" },
    { id: "creative", name: "Creative" },
  ]

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

  // Accept the AI suggestion
  function handleAccept() {
    if (tweetType === "standard" && typeof suggestion === "string") {
      setTweet(suggestion)
    } else if (tweetType === "thread" && Array.isArray(suggestion)) {
      // Create new thread items from suggestions
      const newThread = suggestion.map((content, index) => ({
        id: (index + 1).toString(),
        content,
      }))
      setTweetThread(newThread)
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
          <Badge variant="outline" className="ml-2 bg-primary/5 text-primary">AI Generated</Badge>
        </div>
        <p className="text-muted-foreground mb-2">
          {tweetType === "standard"
            ? "Craft your next viral post with AI"
            : "Create engaging tweet threads with AI assistance"}
        </p>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto p-4">
        {/* Thread Controls - Only show when in thread mode */}
        {tweetType === "thread" && (
          <Card className="mb-4 p-4 flex items-center border border-gray-200/70 bg-white/80 shadow-sm">
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
          </Card>
        )}

        {/* Live Preview */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Live Preview</h2>
          <Card className="p-4 border border-gray-200/70 bg-white/80 shadow-sm">
            {tweetType === "standard" ? (
              // Single tweet preview
              <TweetCard
                post={{ caption: tweet || "Your tweet will appear here" }}
                user={{ full_name: "Demo User", username: "demouser", avatar_url: "/default-avatar.png" }}
              />
            ) : (
              // Thread preview
              <div className="space-y-1">
                {tweetThread.map((tweetItem, index) => (
                  <div key={tweetItem.id} className="relative">
                    {index > 0 && <div className="absolute left-5 top-0 w-0.5 h-4 bg-gray-200 -mt-1"></div>}
                    <TweetCard
                      post={{ caption: tweetItem.content || `Tweet ${index + 1} will appear here` }}
                      user={{ full_name: "Demo User", username: "demouser", avatar_url: "/default-avatar.png" }}
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
                  post={{ caption: suggestion }}
                  user={{ full_name: "Demo User", username: "demouser", avatar_url: "/default-avatar.png" }}
                />
              ) : (
                Array.isArray(suggestion) && (
                  // Thread suggestion
                  <div className="space-y-1">
                    {suggestion.map((tweetContent, index) => (
                      <div key={index} className="relative">
                        {index > 0 && <div className="absolute left-5 top-0 w-0.5 h-4 bg-gray-200 -mt-1"></div>}
                        <TweetCard
                          post={{ caption: tweetContent }}
                          user={{ full_name: "Demo User", username: "demouser", avatar_url: "/default-avatar.png" }}
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
        {error && <Card className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-600 shadow-sm">{error}</Card>}

        {/* Thread Editor - Only show in thread mode */}
        {tweetType === "thread" && (
          <div className="mb-6 space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground">Thread Editor</h2>
            {tweetThread.map((tweetItem, index) => (
              <Card key={tweetItem.id} className="flex gap-2 items-start p-3 border border-gray-200/70 bg-white/80 shadow-sm">
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

      {/* Bottom Creation Toolbar (refined, compact, modern) */}
      <div className="fixed bottom-0 left-0 right-0 w-full z-50 px-2 pb-2 sm:pb-4 sm:left-[130px] sm:right-0 sm:bottom-4 sm:px-0">
        <div className="bg-white/70 backdrop-blur-lg border rounded-t-lg sm:rounded-lg border-gray-200/50 p-1.5 max-w-2xl mx-auto shadow-lg flex flex-row items-center gap-2">
          {/* Brand Kit Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 rounded-full text-xs bg-white/40 backdrop-blur-sm min-w-[90px] px-2 h-8"
              >
                <Palette className="w-4 h-4" />
                <span className="truncate">{validBrandKits.find((bk) => bk.id === selectedBrandKit)?.name || "Brand Kit"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {validBrandKits.length > 0 ? (
                validBrandKits.map((brandKit) => (
                  <DropdownMenuItem key={brandKit.id} onSelect={() => setSelectedBrandKit(brandKit.id)}>
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
                <span className="truncate">{TWEET_TYPES.find((t) => t.value === tweetType)?.label || "Regular Tweet"}</span>
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
                <span className="truncate">Style</span>
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
                <span className="truncate">Mood</span>
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
          {/* Text Input & AI Button (for both standard and thread tweet types) */}
          {(tweetType === "standard" || tweetType === "thread") && (
            <div className="flex flex-row items-center flex-1 min-w-[200px] max-w-[600px] gap-2">
              <Textarea
                value={tweetType === "standard" ? tweet : tweetThread[0].content}
                onChange={e => {
                  if (tweetType === "standard") setTweet(e.target.value)
                  else updateThreadTweet(tweetThread[0].id, e.target.value)
                }}
                maxLength={280}
                rows={1}
                className="w-full px-3 py-2 text-base border rounded-lg border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary bg-[#f7f9fa] resize-none min-h-[40px] max-h-[60px]"
                placeholder="What's happening?"
                style={{ minWidth: 0 }}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleGenerate}
                      disabled={loading || (tweetType === "standard" ? !tweet : !tweetThread[0].content)}
                      className="flex items-center gap-2 rounded-full h-9 px-4 bg-primary text-white shadow-md whitespace-nowrap"
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
              <Button size="sm" variant="ghost" onClick={handleClear} className="h-8 px-2 ml-1">
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
