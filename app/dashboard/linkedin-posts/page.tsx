"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { LinkedInPostCard } from "@/components/social/LinkedInPostCard"
import { Loader2, Sparkles } from "lucide-react"

export default function LinkedInPostsPage() {
  const [post, setPost] = useState("")
  const [suggestion, setSuggestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/generate-linkedin-post", {
        method: "POST",
        body: JSON.stringify({ topic: post }),
        headers: { "Content-Type": "application/json" }
      })
      const data = await res.json()
      setSuggestion(data.suggestion)
    } catch (e) {
      setError("Failed to generate LinkedIn post. Please try again.")
    }
    setLoading(false)
  }

  function handleAccept() {
    setPost(suggestion)
    setSuggestion("")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f6fa] py-12 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-2xl font-bold mb-2">Write a LinkedIn Post</h1>
        <p className="text-gray-500 mb-6">Compose, preview, and generate professional LinkedIn posts with AI.</p>
        <Textarea
          value={post}
          onChange={e => setPost(e.target.value)}
          maxLength={1300}
          rows={6}
          className="mb-2 text-base font-mono resize-none border-2 border-gray-200 focus:border-blue-700 focus:ring-0 bg-[#f3f6fa] rounded-lg"
          placeholder="Share your thoughts, insights, or updates..."
        />
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs ${post.length > 1200 ? 'text-red-500' : 'text-gray-400'}`}>{post.length}/1300</span>
          <Button size="sm" variant="ghost" onClick={() => setPost("")}>Clear</Button>
        </div>
        <div className="flex gap-2 mb-4">
          <Button onClick={handleGenerate} disabled={loading || !post} variant="default" className="flex items-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Generating..." : "AI Suggestion"}
          </Button>
          <Button variant="secondary" disabled>Schedule (Coming Soon)</Button>
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {suggestion && (
          <div className="mt-4">
            <div className="text-xs text-gray-500 mb-1">AI Suggestion</div>
            <LinkedInPostCard post={{ caption: suggestion }} user={{ full_name: "Demo User", headline: "Brand Marketer", avatar_url: "/default-avatar.png" }} />
            <Button className="mt-2" onClick={handleAccept}>Accept</Button>
          </div>
        )}
        <div className="mt-8">
          <div className="text-xs text-gray-400 mb-2">Live Preview</div>
          <LinkedInPostCard post={{ caption: post }} user={{ full_name: "Demo User", headline: "Brand Marketer", avatar_url: "/default-avatar.png" }} />
        </div>
      </div>
    </div>
  )
} 