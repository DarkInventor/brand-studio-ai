"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bean, Clock, ImageIcon, LucideFrame, Maximize2, Mic, Palette, Sparkles, Type, CreditCard } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Image } from "@radix-ui/react-avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Player } from "@remotion/player"
import { Video } from "remotion"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Remotion composition for video editing
const VideoComposition = ({ videoUrl }: { videoUrl: string }) => {
  return <Video src={videoUrl} style={{ width: "100%", height: "100%" }} />
}

export default function DiscoverPage() {
  const [inputValue, setInputValue] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("None")
  const [selectedDuration, setSelectedDuration] = useState("5 sec")
  const [selectedEffect, setSelectedEffect] = useState("None")
  const [selectedQuality, setSelectedQuality] = useState("360p")
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("16:9")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [showTimeline, setShowTimeline] = useState(false)
  const [brandKits, setBrandKits] = useState<any[]>([])
  const [selectedBrandKit, setSelectedBrandKit] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [videoPosts, setVideoPosts] = useState<any[]>([])
  const [editingVideo, setEditingVideo] = useState<any | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [userCredits, setUserCredits] = useState<number>(0)

  // Map duration string to number
  const durationMap: Record<string, number> = {
    "5 sec": 5,
    "8 sec": 8,
    "10 sec": 10,
    "30 sec": 30,
  }

  // Credit cost lookup
  function getVideoCreditCost({ quality, duration, motion_mode }: { quality: string, duration: number, motion_mode: string }) {
    quality = String(quality).toLowerCase();
    duration = Number(duration);
    motion_mode = String(motion_mode).toLowerCase();
    if (duration === 5) {
      if ((quality === "360p" || quality === "540p") && motion_mode === "normal") return 4;
      if (quality === "720p" && motion_mode === "normal") return 5;
      if (quality === "1080p" && motion_mode === "normal") return 11;
      if ((quality === "360p" || quality === "540p") && motion_mode === "smooth") return 8;
      if (quality === "720p" && motion_mode === "smooth") return 11;
    }
    if (duration === 8) {
      if ((quality === "360p" || quality === "540p") && motion_mode === "normal") return 8;
      if (quality === "720p" && motion_mode === "normal") return 11;
    }
    if (duration === 10) {
      if ((quality === "360p" || quality === "540p") && motion_mode === "normal") return 10;
      if (quality === "720p" && motion_mode === "normal") return 14;
      if (quality === "1080p" && motion_mode === "normal") return 22;
    }
    if (duration === 30) {
      if ((quality === "360p" || quality === "540p") && motion_mode === "normal") return 30;
      if (quality === "720p" && motion_mode === "normal") return 41;
      if (quality === "1080p" && motion_mode === "normal") return 65;
    }
    return null;
  }

  useEffect(() => {
    async function fetchBrandKitsAndVideosAndCredits() {
      setIsLoading(true)
      setError(null)
      const supabase = createClient()
      // Fetch user credits
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData?.session?.user?.id) {
        const { data: profileData } = await supabase.from("profiles").select("credits").eq("id", String(sessionData.session.user.id)).single()
        if (
          profileData &&
          typeof profileData === 'object' &&
          'credits' in profileData &&
          typeof (profileData as any).credits === 'number'
        ) {
          setUserCredits((profileData as any).credits)
        }
      }
      // Fetch brand kits
      const { data: kitsRaw, error: kitsError } = await supabase.from("brand_kits").select("*")
      const kits = Array.isArray(kitsRaw) ? (kitsRaw as any[]).filter((k) => k && typeof k.id === 'string') : []
      if (kitsError) {
        setError("Failed to load brand kits")
        setIsLoading(false)
        return
      }
      setBrandKits(kits)
      if (kits.length > 0) {
        setSelectedBrandKit(String(kits[0].id))
        // Fetch video posts for the first brand kit
        const { data: postsRaw, error: postsError } = await supabase
          .from("posts")
          .select("*")
          .eq("brand_kit_id", String(kits[0].id) as any)
          .eq("type", "video" as any)
          .order("created_at", { ascending: false })
        const posts = Array.isArray(postsRaw) ? (postsRaw as any[]).filter((p) => p && typeof p.id === 'string') : []
        if (postsError) {
          setError("Failed to load video posts")
        } else {
          setVideoPosts(posts)
        }
      }
      setIsLoading(false)
    }
    fetchBrandKitsAndVideosAndCredits()
  }, [])

  async function handleBrandKitChange(value: string) {
    setSelectedBrandKit(String(value))
    setIsLoading(true)
    setError(null)
    const supabase = createClient()
    const { data: postsRaw, error: postsError } = await supabase
      .from("posts")
      .select("*")
      .eq("brand_kit_id", String(value) as any)
      .eq("type", "video" as any)
      .order("created_at", { ascending: false })
    const posts = Array.isArray(postsRaw) ? (postsRaw as any[]).filter((p) => p && typeof p.id === 'string') : []
    if (postsError) {
      setError("Failed to load video posts")
    } else {
      setVideoPosts(posts)
    }
    setIsLoading(false)
  }

  // Handle image file selection and convert to base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageBase64(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleCreateVideo() {
    setIsGenerating(true)
    setError(null)
    setShowTimeline(false)
    try {
      const payload: Record<string, any> = {
        style: selectedStyle,
        effect: selectedEffect,
        prompt: inputValue,
        quality: selectedQuality,
        duration: durationMap[selectedDuration] || 5,
        motion_mode: "normal",
        aspect_ratio: selectedAspectRatio,
        negative_prompt: negativePrompt,
        brand_kit_id: selectedBrandKit,
      }
      if (imageBase64) {
        payload.image = imageBase64
      }
      const res = await fetch("/api/video-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to generate video")
      setVideoPosts((prev) => [data.post, ...prev])
      if (typeof data.creditsRemaining === 'number') {
        setUserCredits(data.creditsRemaining)
      }
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setIsGenerating(false)
    }
  }

  // Calculate required credits for current selection
  const requiredCredits = getVideoCreditCost({
    quality: selectedQuality,
    duration: durationMap[selectedDuration] || 5,
    motion_mode: "normal", // If you add a UI for motion_mode, use the selected value
  })
  const hasEnoughCredits = userCredits >= (requiredCredits || 0)

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Video Posts</h1>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{userCredits} credits remaining</span>
          </div>
        </div>
        {/* Brand Kit Dropdown */}
        <div className="mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1.5 rounded-full text-xs bg-white/50 backdrop-blur-sm w-full sm:w-auto min-w-[120px]">
                <Palette className="w-4 h-4" />
                <span className="sm:inline truncate">{Array.isArray(brandKits) && brandKits.find(bk => bk?.id === selectedBrandKit)?.name || "Brand Kit"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Array.isArray(brandKits) && brandKits.length > 0 ? (
                brandKits.map((brandKit) => (
                  <DropdownMenuItem key={brandKit?.id} onSelect={() => handleBrandKitChange(String(brandKit?.id))}>
                    {brandKit?.name}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/brand-kit">Create Brand Kit</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Video Posts Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center my-8">{error}</div>
        ) : Array.isArray(videoPosts) && videoPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center animate-in fade-in duration-500">
            <div className="mb-6 rounded-full bg-primary/10 p-4">
              <ImageIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No video posts generated yet</h3>
            <p className="mb-6 text-muted-foreground max-w-md">
              {Array.isArray(brandKits) && brandKits.length > 0
                ? "Click the button below to generate video posts for your brand"
                : "Create a brand kit first to generate video posts"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.isArray(videoPosts) && videoPosts.map((post) => (
              <Card
                key={post?.id}
                className="group overflow-hidden border border-border/50 bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:translate-y-[-4px]"
              >
                <CardContent className="p-0 relative">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    {post?.video_url ? (
                      <Player
                        component={VideoComposition}
                        durationInFrames={30 * (post.video_duration || 5)}
                        fps={30}
                        compositionWidth={1280}
                        compositionHeight={post.aspect_ratio === "9:16" ? 720 : 720}
                        controls
                        style={{ width: "100%", height: "100%" }}
                        inputProps={{ videoUrl: post.video_url }}
                        autoPlay={false}
                        loop={false}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">No video</div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4">
                  <div className="space-y-2 w-full">
                    <p className="text-sm text-muted-foreground line-clamp-2">{post?.caption}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        Video
                      </Badge>
                      <span className="text-xs text-muted-foreground">{new Date(post?.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        {/* Remotion Timeline Editor Modal */}
        <Dialog open={showTimeline && !!editingVideo} onOpenChange={(open) => { if (!open) { setShowTimeline(false); setEditingVideo(null) } }}>
          <DialogContent className="max-w-4xl w-full">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">Remotion Timeline Editor</h2>
              <button
                className="text-gray-500 hover:text-black"
                onClick={() => { setShowTimeline(false); setEditingVideo(null) }}
              >
                Close
              </button>
            </div>
            {editingVideo?.video_url && (
              <Player
                component={VideoComposition}
                durationInFrames={30 * (editingVideo.video_duration || 5)}
                fps={30}
                compositionWidth={1280}
                compositionHeight={editingVideo.aspect_ratio === "9:16" ? 720 : 720}
                controls
                style={{ width: "100%", height: "auto" }}
                inputProps={{ videoUrl: editingVideo.video_url }}
                autoPlay
                loop
              />
            )}
            <div className="mt-2 text-xs text-gray-500">(Timeline editing coming soon)</div>
          </DialogContent>
        </Dialog>
        {/* Creation toolbar */}
        <div className="fixed bottom-4 left-0 sm:left-[240px] right-0 bg-white/70 backdrop-blur-md border rounded-lg border-gray-200/50 p-1.5 sm:p-2 max-w-5xl mx-auto shadow-lg ">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 border-b border-gray-200/50 pb-2 sm:pb-0 ">
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1.5 rounded-full text-xs bg-white/50 backdrop-blur-sm">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload" className="flex items-center gap-1.5 cursor-pointer">
                  <ImageIcon className="w-4 h-4" />
                  <span>image</span>
                  {/* <span className="hidden sm:inline text-xs text-gray-500">Upload</span> */}
                </label>
              </Button>
              {/* Duration dropdown using DropdownMenu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5 rounded-full text-xs bg-white/50 backdrop-blur-sm">
                    <Clock className="w-4 h-4" />
                    <span className="hidden sm:inline">{selectedDuration}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setSelectedDuration("5 sec")}>5 sec</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedDuration("8 sec")}>8 sec</DropdownMenuItem>
                  {/* <DropdownMenuItem onSelect={() => setSelectedDuration("10 sec")}>10 sec</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedDuration("30 sec")}>30 sec</DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Style dropdown using DropdownMenu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5 rounded-full text-xs bg-white/50 backdrop-blur-sm">
                    <Palette className="w-4 h-4" />
                    <span className="hidden sm:inline">{selectedStyle}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <div className="px-2 py-1.5 text-xs text-gray-500">Select a style</div>
                  <DropdownMenuItem onSelect={() => setSelectedStyle("None")}>None</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedStyle("anime")}>anime</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedStyle("3d animation")}>3d animation</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedStyle("clay")}>clay</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedStyle("cyberpunk")}>cyberpunk</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedStyle("comic")}>comic</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Effect dropdown using DropdownMenu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5 rounded-full text-xs bg-white/50 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4" />
                    <span className="hidden sm:inline">{selectedEffect}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                <div className="px-2 py-1.5 text-xs text-gray-500">Select an effect</div>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("None")}>None</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Let's YMCA!")}>Let's YMCA!</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Subject 3 Fever")}>Subject 3 Fever</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Ghibli Live!")}>Ghibli Live!</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Suit Swagger")}>Suit Swagger</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Muscle Surge")}>Muscle Surge</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("360° Microwave")}>360° Microwave</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Warmth of Jesus")}>Warmth of Jesus</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Emergency Beat")}>Emergency Beat</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Anything, Robot")}>Anything, Robot</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Kungfu Club")}>Kungfu Club</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Mint in Box")}>Mint in Box</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Retro Anime Pop")}>Retro Anime Pop</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Vogue Walk")}>Vogue Walk</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Mega Dive")}>Mega Dive</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Evil Trigger")}>Evil Trigger</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5 rounded-full text-xs bg-white/50 backdrop-blur-sm">
                    <LucideFrame className="w-4 h-4" /><span className="hidden sm:inline">{selectedQuality}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setSelectedQuality("360p")}>360p</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedQuality("540p")}>540p</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedQuality("720p")}>720p</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedQuality("1080p")}>1080p</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Aspect Ratio dropdown using DropdownMenu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5 rounded-full text-xs bg-white/50 backdrop-blur-sm">
                    <Maximize2 className="w-4 h-4" /><span className="hidden sm:inline">{selectedAspectRatio}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setSelectedAspectRatio("16:9")}>16:9</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedAspectRatio("9:16")}>9:16</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedAspectRatio("1:1")}>1:1</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            <div className="relative flex-1">
              <Textarea
                className="bg-white/50 backdrop-blur-sm border-gray-200/50 text-sm h-16 border ring-offset-0 focus-visible:ring-0 "
                placeholder="a cute panda eating in the forest"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="text-xs text-gray-500 mt-0.5 ml-1">Text prompt for video generation</div>
              <Input
                className="pl-3 pr-3 mt-2 rounded-full border-gray-200/50 bg-white/50 backdrop-blur-sm w-full text-sm h-8"
                placeholder="Enter negative prompt"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
              />
              <div className="text-xs text-gray-500 mt-0.5 ml-1">negative_prompt</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-1.5 gap-1.5">          
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full sm:w-auto mt-2 sm:mt-0">
                    <Button
                      className="bg-primary text-white rounded-full px-4 backdrop-blur-sm w-full sm:w-auto mt-1 sm:mt-0 text-sm h-8"
                      onClick={handleCreateVideo}
                      disabled={isGenerating || !hasEnoughCredits}
                    >
                      {isGenerating ? "Generating..." : `Create (${requiredCredits || 0} credits)`}
                    </Button>
                  </div>
                </TooltipTrigger>
                {!hasEnoughCredits && (
                  <TooltipContent>
                    <p>
                      Not enough credits. You need {requiredCredits} credits but only have {userCredits}.
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
          {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
        </div>
      </div>
    </div>
  )
}
