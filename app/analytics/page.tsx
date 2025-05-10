"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer } from "@/components/ui/chart"
import { createClient } from "@/lib/supabase/client"
import type { Post, BrandKit } from "@/lib/supabase/database.types"
import { Loader2 } from "lucide-react"

export default function AnalyticsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [brandKits, setBrandKits] = useState<BrandKit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setError("Not authenticated")
          setLoading(false)
          return
        }
        const userId = session.user.id
        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", userId)
        const { data: brandKitsData, error: brandKitsError } = await supabase
          .from("brand_kits")
          .select("*")
          .eq("user_id", userId)
        if (postsError || brandKitsError) {
          setError(postsError?.message || brandKitsError?.message || "Error fetching data")
        } else {
          setPosts(postsData || [])
          setBrandKits(brandKitsData || [])
        }
      } catch (e: any) {
        setError(e.message)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  // Analytics calculations
  const totalPosts = posts.length
  const postsByBrand = brandKits.map(kit => ({
    id: kit.id,
    name: kit.name,
    count: posts.filter(p => p.brand_kit_id === kit.id).length
  }))
  const postsByMonth = posts.reduce((acc, post) => {
    const month = new Date(post.created_at).toLocaleString("default", { month: "short", year: "numeric" })
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-red-500 font-medium">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{totalPosts}</div>
              <Badge variant="outline" className="mt-2">All Time</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Brand Kits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{brandKits.length}</div>
              <Badge variant="outline" className="mt-2">Active Brands</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Posts by Brand</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {postsByBrand.map(b => (
                  <li key={b.id} className="flex justify-between">
                    <span>{b.name}</span>
                    <span className="font-semibold">{b.count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
      {/* Chart Section */}
      {!loading && !error && (
        <div className="bg-card rounded-lg p-6 shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Posts Over Time</h2>
          <ChartContainer
            config={{}}
            className="h-72"
          >
            <BarChart
              width={600}
              height={250}
              data={Object.entries(postsByMonth).map(([month, count]) => ({ month, count }))}
            >
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      )}
    </div>
  )
}

// Chart primitives from recharts
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts" 