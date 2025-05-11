"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PLAN_CREDITS } from "@/config/stripe"
import { Loader2 } from "lucide-react"

export default function UpdateSubscriptionPage() {
  const [userId, setUserId] = useState("")
  const [plan, setPlan] = useState("Pro")
  const [customCredits, setCustomCredits] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/update-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          plan,
          customCredits: customCredits || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update subscription")
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Calculate credits based on selected plan
  const planCredits = plan ? PLAN_CREDITS[plan as keyof typeof PLAN_CREDITS] || 0 : 0

  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Update Subscription Status</CardTitle>
          <CardDescription>Manually update a user's subscription status and credits in the database.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan">Subscription Plan</Label>
              <Select value={plan} onValueChange={setPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Starter">Starter ($9) - 500 credits</SelectItem>
                  <SelectItem value="Pro">Pro ($24) - 2,000 credits</SelectItem>
                  <SelectItem value="Business">Business ($59) - 5,000 credits</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credits">Custom Credits (Optional) - Default: {planCredits} credits</Label>
              <Input
                id="credits"
                type="number"
                value={customCredits}
                onChange={(e) => setCustomCredits(e.target.value)}
                placeholder={`Default: ${planCredits}`}
              />
              <p className="text-sm text-gray-500">Leave empty to use the default credits for the selected plan.</p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update Subscription"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          {error && <div className="text-red-500 mt-2">{error}</div>}
          {result && (
            <div className="mt-4 w-full">
              <h3 className="font-medium text-green-600">Update Successful!</h3>
              <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto text-xs">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
