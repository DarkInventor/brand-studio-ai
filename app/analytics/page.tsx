"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer } from "@/components/ui/chart"
import { createClient } from "@/lib/supabase/client"
import type { Post, BrandKit } from "@/lib/supabase/database.types"
import { Loader2 } from "lucide-react"
import { AuroraText } from "@/components/magicui/aurora-text"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { DotPattern } from "@/components/magicui/dot-pattern"
import { RainbowButton } from "@/components/magicui/rainbow-button"
import { Info, Calendar, DollarSign, Layers, BarChart3, User, Download } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

export default function AnalyticsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [brandKits, setBrandKits] = useState<BrandKit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scheduledPostsCount, setScheduledPostsCount] = useState<number>(0)
  const [personalCost, setPersonalCost] = useState<number>(0)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session) {
          setError("Not authenticated")
          setLoading(false)
          return
        }
        const userId = session.user.id
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single()
        setUser({ ...session.user, profile })
        const { data: postsData, error: postsError } = await supabase.from("posts").select("*").eq("user_id", userId)
        const { data: brandKitsData, error: brandKitsError } = await supabase
          .from("brand_kits")
          .select("*")
          .eq("user_id", userId)
        const { count: scheduledCount, error: scheduledError } = await supabase
          .from("posts")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId)
          .not("scheduled_for", "is", null)
        if (postsError || brandKitsError || scheduledError) {
          setError(postsError?.message || brandKitsError?.message || scheduledError?.message || "Error fetching data")
        } else {
          setPosts(postsData || [])
          setBrandKits(brandKitsData || [])
          setScheduledPostsCount(scheduledCount || 0)
          setPersonalCost((postsData?.length || 0) * 0.011)
        }
      } catch (e: any) {
        setError(e.message)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  // Helper: filter out posts with valid updated_at
  function isValidDate(dateString: string | null | undefined) {
    if (!dateString) return false
    const d = new Date(dateString)
    return d instanceof Date && !isNaN(d.getTime()) && d.getFullYear() > 2000
  }
  const validPosts = posts.filter((p) => isValidDate(p.updated_at))

  // Analytics calculations (use validPosts)
  const totalPosts = validPosts.length
  const postsByBrand = brandKits.map((kit) => ({
    id: kit.id,
    name: kit.name,
    count: validPosts.filter((p) => p.brand_kit_id === kit.id).length,
  }))
  const postsByMonthRaw = validPosts.reduce(
    (acc, post) => {
      const month = new Date(post.updated_at).toLocaleString("default", { month: "short", year: "numeric" })
      acc[month] = (acc[month] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Fill missing months for continuous timeline
  function getMonthRange(start: Date, end: Date) {
    const months = []
    const date = new Date(start.getFullYear(), start.getMonth(), 1)
    while (date <= end) {
      months.push(date.toLocaleString("default", { month: "short", year: "numeric" }))
      date.setMonth(date.getMonth() + 1)
    }
    return months
  }
  let postsByMonth = postsByMonthRaw
  let chartMonths: string[] = []
  if (validPosts.length > 0) {
    const sortedDates = validPosts.map(p => new Date(p.updated_at)).sort((a, b) => a.getTime() - b.getTime())
    const minDate = new Date(sortedDates[0].getFullYear(), sortedDates[0].getMonth(), 1)
    const maxDate = new Date(sortedDates[sortedDates.length - 1].getFullYear(), sortedDates[sortedDates.length - 1].getMonth(), 1)
    chartMonths = getMonthRange(minDate, maxDate)
    postsByMonth = chartMonths.reduce((acc, month) => {
      acc[month] = postsByMonthRaw[month] || 0
      return acc
    }, {} as Record<string, number>)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-base">Loading analytics</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-destructive text-lg mb-2">Error loading analytics</div>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-white">
      {/* Subtle dot pattern background */}
      <DotPattern
        className="absolute inset-0 z-0 opacity-20 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
        width={24}
        height={24}
      />

      <div className="relative z-10 container mx-auto px-4 py-5 max-w-6xl">
        {/* Header with export button */}
        <div className="flex justify-between items-center mb-8">
          <span className="text-2xl font-bold">Analytics</span>
          {/* <RainbowButton className="h-9 px-4 text-xs font-medium flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Export
          </RainbowButton> */}
        </div>

        {/* Main metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border border-gray-100 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="text-primary h-4 w-4" />
                Total Posts
              </CardTitle>
              <Badge variant="outline" className="text-xs font-normal">
                All Time
              </Badge>
            </CardHeader>
            <CardContent>
              <NumberTicker value={totalPosts} className="text-3xl font-semibold text-gray-900" />
              <p className="text-xs text-muted-foreground mt-1">Content across all brands</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Layers className="text-primary h-4 w-4" />
                Brand Kits
              </CardTitle>
              <Badge variant="outline" className="text-xs font-normal">
                Active
              </Badge>
            </CardHeader>
            <CardContent>
              <NumberTicker value={brandKits.length} className="text-3xl font-semibold text-gray-900" />
              <p className="text-xs text-muted-foreground mt-1">Brand identities</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="text-primary h-4 w-4" />
                Personal Cost
              </CardTitle>
              <Badge variant="outline" className="text-xs font-normal">
                $0.011/image
              </Badge>
            </CardHeader>
            <CardContent>
              <NumberTicker
                value={personalCost}
                decimalPlaces={2}
                prefix="$"
                className="text-3xl font-semibold text-gray-900"
              />
              <p className="text-xs text-muted-foreground mt-1">Based on {totalPosts} images</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="text-primary h-4 w-4" />
                Scheduled Posts
              </CardTitle>
              <Badge variant="outline" className="text-xs font-normal">
                Upcoming
              </Badge>
            </CardHeader>
            <CardContent>
              <NumberTicker value={scheduledPostsCount} className="text-3xl font-semibold text-gray-900" />
              <p className="text-xs text-muted-foreground mt-1">Future publications</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and data visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <Card className="border border-gray-100 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <User className="text-primary h-4 w-4" />
                Posts by Brand
              </CardTitle>
            </CardHeader>
            <CardContent>
              {postsByBrand.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">No brand data available</div>
              ) : (
                <ul className="space-y-2.5">
                  {postsByBrand.map((b, index) => (
                    <li key={b.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700">{b.name}</span>
                        <span className="text-sm font-medium text-gray-700">{b.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.max(5, (b.count / Math.max(...postsByBrand.map((b) => b.count))) * 100)}%`,
                            backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))`,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="border border-gray-100 bg-white lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="text-primary h-4 w-4" />
                  Posts Over Time
                </CardTitle>
                <Badge variant="outline" className="text-xs font-normal">
                  Monthly
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {Object.keys(postsByMonth).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">No timeline data available</div>
              ) : (
                <ChartContainer config={{}} className="h-64">
                  <BarChart
                    width={600}
                    height={250}
                    data={chartMonths.map((month) => ({ month, count: Number(postsByMonth[month] || 0) }))}
                    margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f3f3" />
                    <XAxis
                      dataKey="month"
                      stroke="#888"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#f1f1f1" }}
                    />
                    <YAxis
                      allowDecimals={false}
                      stroke="#888"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#f1f1f1" }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #f1f1f1",
                        borderRadius: "4px",
                        padding: "8px 12px",
                        fontSize: "12px",
                        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)"
                      }}
                      cursor={{ fill: "rgba(0, 0, 0, 0.04)" }}
                    />
                    <Bar
                      dataKey="count"
                      radius={[8, 8, 0, 0]}
                      fill="url(#barGradient)"
                      barSize={32}
                    />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity="0.4" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Section - Simplified */}
        <Card className="border border-gray-100 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Info className="text-primary h-4 w-4" />
              Quick Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Most Active Brand Kit</div>
                <div className="text-sm font-medium mt-1">
                  {postsByBrand.length > 0 ? postsByBrand.sort((a, b) => b.count - a.count)[0].name : "No data"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Average Posts per Brand</div>
                <div className="text-sm font-medium mt-1">
                  {brandKits.length > 0 ? (totalPosts / brandKits.length).toFixed(1) : "No data"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Most Active Month</div>
                <div className="text-sm font-medium mt-1">
                  {Object.keys(postsByMonth).length > 0
                    ? Object.entries(postsByMonth).sort((a, b) => b[1] - a[1])[0][0]
                    : "No data"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
