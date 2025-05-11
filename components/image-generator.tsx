"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCredits, checkCredits } from "@/utils/use-credits"
import { Loader2, ImageIcon, AlertCircle } from "lucide-react"
import Link from "next/link"

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [creditsInfo, setCreditsInfo] = useState<any>(null)
  const [checkingCredits, setCheckingCredits] = useState(false)
  const [creditUsageResult, setCreditUsageResult] = useState<{
    success: boolean
    remainingCredits?: number
    error?: string
  } | null>(null)

  // Call useCredits unconditionally
  const creditUsage = useCredits(1)

  useEffect(() => {
    if (creditUsage.success !== undefined) {
      setCreditUsageResult({
        success: creditUsage.success,
        remainingCredits: creditUsage.remainingCredits,
        error: creditUsage.error,
      })
    }
  }, [creditUsage])

  // Check credits before generating
  const handleCheckCredits = async () => {
    setCheckingCredits(true)
    setError(null)

    try {
      const result = await checkCredits(1)
      setCreditsInfo(result)

      return result.hasEnough
    } catch (err) {
      console.error("Error checking credits:", err)
      setError("Failed to check credits")
      return false
    } finally {
      setCheckingCredits(false)
    }
  }

  // Generate image and use credits
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt")
      return
    }

    // First check if user has enough credits
    const hasEnoughCredits = await handleCheckCredits()

    if (!hasEnoughCredits) {
      setError("Not enough credits to generate an image")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // This is where you would call your actual image generation API
      // For this example, we'll just simulate it

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Use a credit
      if (!creditUsageResult?.success) {
        throw new Error(creditUsageResult?.error || "Failed to use credits")
      }

      // Update credits info
      setCreditsInfo({
        ...creditsInfo,
        credits: creditUsageResult?.remainingCredits,
      })

      // Set a placeholder image
      setGeneratedImage(`https://source.unsplash.com/random/800x600?${encodeURIComponent(prompt)}`)
    } catch (err: any) {
      console.error("Error generating image:", err)
      setError(err.message || "Failed to generate image")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>AI Image Generator</CardTitle>
        <CardDescription>Generate images using your credits</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {creditsInfo && (
          <div className="text-sm mb-4">
            <span className="font-medium">Credits remaining:</span> {creditsInfo.credits}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="prompt">Image Prompt</Label>
          <Input
            id="prompt"
            placeholder="Describe the image you want to generate"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p>{error}</p>
              {creditsInfo && !creditsInfo.hasEnough && (
                <p className="mt-2">
                  <Link href="/pricing" className="text-primary underline">
                    Upgrade your plan
                  </Link>{" "}
                  to get more credits.
                </p>
              )}
            </div>
          </div>
        )}

        {generatedImage && (
          <div className="mt-4">
            <img
              src={generatedImage || "/placeholder.svg"}
              alt="Generated"
              className="w-full h-auto rounded-md shadow-md"
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerate} disabled={loading || checkingCredits || !prompt.trim()} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
            </>
          ) : checkingCredits ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking credits...
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" /> Generate Image (1 credit)
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
