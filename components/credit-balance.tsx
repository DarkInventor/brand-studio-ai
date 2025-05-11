"use client"

import { useState, useEffect } from "react"
import { CreditCard, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export function CreditBalance() {
  const [credits, setCredits] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCredits() {
      try {
        setLoading(true)

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setError("Not logged in")
          return
        }

        // Fetch user profile with credits
        const { data, error } = await supabase.from("profiles").select("credits").eq("id", user.id).single()

        if (error) {
          console.error("Error fetching credits:", error)
          setError("Failed to load credits")
          return
        }

        setCredits(data?.credits || 0)
      } catch (error) {
        console.error("Error fetching credits:", error)
        setError("Failed to load credits")
      } finally {
        setLoading(false)
      }
    }

    fetchCredits()
  }, [])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Credit Balance
        </CardTitle>
        <CardDescription>Your available credits for generating content</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-2">{error}</div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-4xl font-bold">{credits}</span>
              <span className="text-gray-500 ml-2">credits remaining</span>
            </div>
            <div className="text-sm text-gray-500 text-center">
              Each image generation uses 1 credit from your balance.
            </div>
            {credits !== null && credits < 50 && (
              <div className="pt-2">
                <Button asChild className="w-full">
                  <Link href="/pricing">Upgrade for More Credits</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
