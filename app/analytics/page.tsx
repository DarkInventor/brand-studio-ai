// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { createClient } from "@/lib/supabase/client"
// import type { Post, BrandKit } from "@/lib/supabase/database.types"
// import {
//   Loader2,
//   Info,
//   Calendar,
//   DollarSign,
//   Layers,
//   BarChart3,
//   User,
//   Download,
//   TrendingUp,
//   RefreshCw,
//   ArrowUpRight,
//   ArrowDownRight,
//   Share2,
//   PieChart,
//   Clock,
//   Zap,
//   Sparkles,
//   BrainCircuit,
//   AlertCircle,
//   CheckCircle2,
//   MessageSquare,
//   LineChartIcon,
//   Palette,
// } from "lucide-react"
// import { NumberTicker } from "@/components/magicui/number-ticker"
// import { DotPattern } from "@/components/magicui/dot-pattern"
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart as RechartBarChart,
//   Bar,
//   PieChart as RechartsPieChart,
//   Pie,
//   Cell,
// } from "recharts"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Skeleton } from "@/components/ui/skeleton"
// import { useToast } from "@/hooks/use-toast"
// import { generateAIFeedback, type AIFeedbackResponse } from "@/lib/actions/ai-feedback"
// import { Progress } from "@/components/ui/progress"

// export default function AnalyticsPage() {
//   const [posts, setPosts] = useState<Post[]>([])
//   const [brandKits, setBrandKits] = useState<BrandKit[]>([])
//   const [loading, setLoading] = useState(true)
//   const [refreshing, setRefreshing] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [scheduledPostsCount, setScheduledPostsCount] = useState<number>(0)
//   const [personalCost, setPersonalCost] = useState<number>(0)
//   const [user, setUser] = useState<any>(null)
//   const [timeRange, setTimeRange] = useState<string>("all")
//   const [activeTab, setActiveTab] = useState<string>("overview")
//   const [aiFeedback, setAiFeedback] = useState<AIFeedbackResponse | null>(null)
//   const [loadingAI, setLoadingAI] = useState<boolean>(false)
//   const { toast } = useToast()

//   // Helper: filter out posts with valid updated_at
//   function isValidDate(dateString: string | null | undefined) {
//     if (!dateString) return false
//     const d = new Date(dateString)
//     return d instanceof Date && !isNaN(d.getTime()) && d.getFullYear() > 2000
//   }

//   // Helper type guard for AI suggestion object
//   function isAISuggestionObject(item: any): item is { suggestion: string; rationale?: string; exampleImplementation?: string } {
//     return item && typeof item === "object" && "suggestion" in item
//   }

//   async function fetchData(showRefreshIndicator = false) {
//     if (showRefreshIndicator) {
//       setRefreshing(true)
//     } else {
//       setLoading(true)
//     }
//     setError(null)

//     try {
//       const supabase = createClient()
//       const {
//         data: { session },
//       } = await supabase.auth.getSession()

//       if (!session) {
//         setError("Not authenticated")
//         setLoading(false)
//         setRefreshing(false)
//         return
//       }

//       const userId = session.user.id
//       const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId as any).single()
//       setUser({ ...session.user, profile })

//       const { data: postsData, error: postsError } = await supabase.from("posts").select("*").eq("user_id", userId as any)
//       const { data: brandKitsData, error: brandKitsError } = await supabase
//         .from("brand_kits")
//         .select("*")
//         .eq("user_id", userId as any)
//       const { count: scheduledCount, error: scheduledError } = await supabase
//         .from("posts")
//         .select("id", { count: "exact", head: true })
//         .eq("user_id", userId as any)
//         .not("scheduled_for", "is", null)

//       // Filter out error objects before setPosts/setBrandKits
//       const postsRows: Post[] = ((postsData ?? []) as unknown[]).filter((x: any): x is Post => x && typeof x === 'object' && 'id' in x && 'updated_at' in x)
//       const brandKitsRows: BrandKit[] = ((brandKitsData ?? []) as unknown[]).filter((x: any): x is BrandKit => x && typeof x === 'object' && 'id' in x && 'name' in x)
//       setPosts(postsRows)
//       setBrandKits(brandKitsRows)
//       setScheduledPostsCount(scheduledCount || 0)
//       setPersonalCost((postsRows.length || 0) * 0.011)

//       if (showRefreshIndicator) {
//         toast({
//           title: "Analytics refreshed",
//           description: "Your analytics data has been updated",
//         })
//       }
//     } catch (e: any) {
//       setError(e.message)
//     }

//     setLoading(false)
//     setRefreshing(false)
//   }

//   async function fetchAIFeedback() {
//     setLoadingAI(true)
//     try {
//       const feedback = await generateAIFeedback(timeRange)
//       setAiFeedback(feedback)

//       if (feedback.error) {
//         toast({
//           title: "AI Feedback Error",
//           description: feedback.error,
//           variant: "destructive",
//         })
//       } else {
//         toast({
//           title: "AI Analysis Complete",
//           description: "Your content has been analyzed successfully",
//         })
//       }
//     } catch (error: any) {
//       toast({
//         title: "AI Feedback Error",
//         description: error.message || "Failed to generate AI feedback",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingAI(false)
//     }
//   }

//   useEffect(() => {
//     fetchData()
//   }, [])

//   // Reset AI feedback when time range changes
//   useEffect(() => {
//     setAiFeedback(null)
//   }, [timeRange])

//   // Filter posts based on selected time range
//   const getFilteredPosts = () => {
//     const validPosts = posts.filter((p) => isValidDate(p.updated_at))

//     if (timeRange === "all") {
//       return validPosts
//     }

//     const now = new Date()
//     const cutoffDate = new Date()

//     switch (timeRange) {
//       case "7days":
//         cutoffDate.setDate(now.getDate() - 7)
//         break
//       case "30days":
//         cutoffDate.setDate(now.getDate() - 30)
//         break
//       case "90days":
//         cutoffDate.setDate(now.getDate() - 90)
//         break
//       default:
//         return validPosts
//     }

//     return validPosts.filter((post) => {
//       const postDate = new Date(post.updated_at || "")
//       return postDate >= cutoffDate
//     })
//   }

//   const filteredPosts = getFilteredPosts()

//   // Analytics calculations
//   const totalPosts = filteredPosts.length
//   const postsByBrand = brandKits.map((kit) => ({
//     id: kit.id,
//     name: kit.name,
//     count: filteredPosts.filter((p) => p.brand_kit_id === kit.id).length,
//     value: filteredPosts.filter((p) => p.brand_kit_id === kit.id).length,
//   }))

//   // Calculate growth rate
//   const calculateGrowth = () => {
//     if (timeRange === "all" || filteredPosts.length === 0) return null

//     const now = new Date()
//     const previousCutoff = new Date()
//     const currentCutoff = new Date()

//     switch (timeRange) {
//       case "7days":
//         previousCutoff.setDate(now.getDate() - 14)
//         currentCutoff.setDate(now.getDate() - 7)
//         break
//       case "30days":
//         previousCutoff.setDate(now.getDate() - 60)
//         currentCutoff.setDate(now.getDate() - 30)
//         break
//       case "90days":
//         previousCutoff.setDate(now.getDate() - 180)
//         currentCutoff.setDate(now.getDate() - 90)
//         break
//       default:
//         return null
//     }

//     const currentPeriodPosts = filteredPosts.filter((post) => {
//       const postDate = new Date(post.updated_at || "")
//       return postDate >= currentCutoff
//     }).length

//     const previousPeriodPosts = posts.filter((post) => {
//       const postDate = new Date(post.updated_at || "")
//       return postDate >= previousCutoff && postDate < currentCutoff
//     }).length

//     if (previousPeriodPosts === 0) return currentPeriodPosts > 0 ? 100 : 0

//     return ((currentPeriodPosts - previousPeriodPosts) / previousPeriodPosts) * 100
//   }

//   const growthRate = calculateGrowth()

//   // Posts by month
//   const postsByMonth = filteredPosts.reduce(
//     (acc, post) => {
//       const month = new Date(post.updated_at || "").toLocaleString("default", { month: "short", year: "numeric" })
//       acc[month] = (acc[month] || 0) + 1
//       return acc
//     },
//     {} as Record<string, number>,
//   )

//   // Posts by day of week
//   const postsByDayOfWeek = filteredPosts.reduce(
//     (acc, post) => {
//       const dayOfWeek = new Date(post.updated_at || "").toLocaleString("default", { weekday: "short" })
//       acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1
//       return acc
//     },
//     {} as Record<string, number>,
//   )

//   // Format data for charts
//   const lineChartData = Object.entries(postsByMonth)
//     .map(([month, count]) => ({ month, count: Number(count) }))
//     .sort((a, b) => {
//       const [aMonth, aYear] = a.month.split(" ")
//       const [bMonth, bYear] = b.month.split(" ")
//       const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
//       if (aYear !== bYear) return Number(aYear) - Number(bYear)
//       return months.indexOf(aMonth) - months.indexOf(bMonth)
//     })

//   const barChartData = Object.entries(postsByDayOfWeek)
//     .map(([day, count]) => ({ day, count: Number(count) }))
//     .sort((a, b) => {
//       const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
//       return days.indexOf(a.day) - days.indexOf(b.day)
//     })

//   const pieChartData = postsByBrand.filter((brand) => brand.count > 0)
//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

//   // Export analytics data as CSV
//   const exportAnalytics = () => {
//     // Create CSV content
//     let csvContent = "data:text/csv;charset=utf-8,"

//     // Headers
//     csvContent += "Category,Metric,Value\n"

//     // Add main metrics
//     csvContent += `Overview,Total Posts,${totalPosts}\n`
//     csvContent += `Overview,Brand Kits,${brandKits.length}\n`
//     csvContent += `Overview,Personal Cost,$${personalCost.toFixed(2)}\n`
//     csvContent += `Overview,Scheduled Posts,${scheduledPostsCount}\n`

//     // Add posts by brand
//     postsByBrand.forEach((brand) => {
//       csvContent += `Brand Distribution,${brand.name},${brand.count}\n`
//     })

//     // Add posts by month
//     Object.entries(postsByMonth).forEach(([month, count]) => {
//       csvContent += `Monthly Distribution,${month},${count}\n`
//     })

//     // Create download link
//     const encodedUri = encodeURI(csvContent)
//     const link = document.createElement("a")
//     link.setAttribute("href", encodedUri)
//     link.setAttribute("download", `analytics_export_${new Date().toISOString().split("T")[0]}.csv`)
//     document.body.appendChild(link)

//     // Trigger download
//     link.click()
//     document.body.removeChild(link)

//     toast({
//       title: "Export successful",
//       description: "Your analytics data has been exported as CSV",
//     })
//   }

//   if (loading) {
//     return (
//       <div className="relative min-h-screen bg-white">
//         <DotPattern
//           className="absolute inset-0 z-0 opacity-20 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
//           width={24}
//           height={24}
//         />
//         <div className="relative z-10 container mx-auto px-4 py-5 max-w-6xl">
//           <div className="flex justify-between items-center mb-8">
//             <Skeleton className="h-8 w-32" />
//             <Skeleton className="h-9 w-24" />
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//             {[...Array(4)].map((_, i) => (
//               <Card key={i} className="border border-gray-100 bg-white">
//                 <CardHeader className="pb-2">
//                   <Skeleton className="h-5 w-32" />
//                 </CardHeader>
//                 <CardContent>
//                   <Skeleton className="h-8 w-20 mb-2" />
//                   <Skeleton className="h-4 w-40" />
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
//             <Skeleton className="h-[300px] rounded-lg" />
//             <Skeleton className="h-[300px] lg:col-span-2 rounded-lg" />
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen p-4">
//         <div className="text-destructive text-lg mb-2">Error loading analytics</div>
//         <p className="text-muted-foreground">{error}</p>
//         <Button variant="outline" className="mt-4" onClick={() => fetchData()}>
//           Try Again
//         </Button>
//       </div>
//     )
//   }

//   return (
//     <div className="relative min-h-screen bg-white">
//       {/* Subtle dot pattern background */}
//       <DotPattern
//         className="absolute inset-0 z-0 opacity-20 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
//         width={24}
//         height={24}
//       />

//       <div className="relative z-10 container mx-auto px-4 py-5 max-w-6xl">
//         {/* Header with controls */}
//         <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
//           <div>
//             <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
//             <p className="text-muted-foreground text-sm">Track your content performance and insights</p>
//           </div>

//           <div className="flex flex-wrap items-center gap-2">
//             <Select value={timeRange} onValueChange={setTimeRange}>
//               <SelectTrigger className="w-[140px] h-9">
//                 <SelectValue placeholder="Time Range" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Time</SelectItem>
//                 <SelectItem value="7days">Last 7 Days</SelectItem>
//                 <SelectItem value="30days">Last 30 Days</SelectItem>
//                 <SelectItem value="90days">Last 90 Days</SelectItem>
//               </SelectContent>
//             </Select>

//             <Button variant="outline" size="sm" className="h-9" onClick={() => fetchData(true)} disabled={refreshing}>
//               {refreshing ? (
//                 <>
//                   <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
//                   Refreshing...
//                 </>
//               ) : (
//                 <>
//                   <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
//                   Refresh
//                 </>
//               )}
//             </Button>

//             <Button variant="outline" size="sm" className="h-9" onClick={exportAnalytics}>
//               <Download className="h-3.5 w-3.5 mr-1.5" />
//               Export
//             </Button>
//           </div>
//         </div>

//         {/* Tabs for different analytics views */}
//         <Tabs defaultValue="overview" className="mb-8" onValueChange={setActiveTab}>
//           <TabsList className="mb-4">
//             <TabsTrigger value="overview">Overview</TabsTrigger>
//             <TabsTrigger value="content">Content Analysis</TabsTrigger>
//             <TabsTrigger value="performance">Performance</TabsTrigger>
//             <TabsTrigger value="ai-feedback">AI Feedback</TabsTrigger>
//           </TabsList>

//           <TabsContent value="overview">
//             {/* Main metrics */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//               <Card className="border border-gray-100 bg-white">
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium flex items-center gap-2">
//                     <BarChart3 className="text-primary h-4 w-4" />
//                     Total Posts
//                   </CardTitle>
//                   <Badge variant="outline" className="text-xs font-normal">
//                     {timeRange === "all"
//                       ? "All Time"
//                       : timeRange === "7days"
//                         ? "7 Days"
//                         : timeRange === "30days"
//                           ? "30 Days"
//                           : "90 Days"}
//                   </Badge>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex items-center">
//                     <NumberTicker value={totalPosts} className="text-3xl font-semibold text-gray-900" />
//                     {growthRate !== null && (
//                       <Badge
//                         className={`ml-2 ${growthRate >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
//                       >
//                         {growthRate >= 0 ? (
//                           <ArrowUpRight className="h-3 w-3 mr-1" />
//                         ) : (
//                           <ArrowDownRight className="h-3 w-3 mr-1" />
//                         )}
//                         {Math.abs(growthRate).toFixed(1)}%
//                       </Badge>
//                     )}
//                   </div>
//                   <p className="text-xs text-muted-foreground mt-1">Content across all brands</p>
//                 </CardContent>
//               </Card>

//               <Card className="border border-gray-100 bg-white">
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium flex items-center gap-2">
//                     <Layers className="text-primary h-4 w-4" />
//                     Brand Kits
//                   </CardTitle>
//                   <Badge variant="outline" className="text-xs font-normal">
//                     Active
//                   </Badge>
//                 </CardHeader>
//                 <CardContent>
//                   <NumberTicker value={brandKits.length} className="text-3xl font-semibold text-gray-900" />
//                   <p className="text-xs text-muted-foreground mt-1">Brand identities</p>
//                 </CardContent>
//               </Card>

//               <Card className="border border-gray-100 bg-white">
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium flex items-center gap-2">
//                     <DollarSign className="text-primary h-4 w-4" />
//                     Personal Cost
//                   </CardTitle>
//                   <Badge variant="outline" className="text-xs font-normal">
//                     $0.011/image
//                   </Badge>
//                 </CardHeader>
//                 <CardContent>
//                   <NumberTicker
//                     value={personalCost}
//                     decimalPlaces={2}
//                     prefix="$"
//                     className="text-3xl font-semibold text-gray-900"
//                   />
//                   <p className="text-xs text-muted-foreground mt-1">Based on {totalPosts} images</p>
//                 </CardContent>
//               </Card>

//               <Card className="border border-gray-100 bg-white">
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium flex items-center gap-2">
//                     <Calendar className="text-primary h-4 w-4" />
//                     Scheduled Posts
//                   </CardTitle>
//                   <Badge variant="outline" className="text-xs font-normal">
//                     Upcoming
//                   </Badge>
//                 </CardHeader>
//                 <CardContent>
//                   <NumberTicker value={scheduledPostsCount} className="text-3xl font-semibold text-gray-900" />
//                   <p className="text-xs text-muted-foreground mt-1">Future publications</p>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Charts and data visualization */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
//               <Card className="border border-gray-100 bg-white">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium flex items-center gap-2">
//                     <PieChart className="text-primary h-4 w-4" />
//                     Posts by Brand
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {pieChartData.length === 0 ? (
//                     <div className="text-center py-4 text-muted-foreground text-sm">No brand data available</div>
//                   ) : (
//                     <div className="h-[220px]">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <RechartsPieChart>
//                           <Pie
//                             data={pieChartData}
//                             cx="50%"
//                             cy="50%"
//                             labelLine={false}
//                             outerRadius={80}
//                             fill="#8884d8"
//                             dataKey="value"
//                             nameKey="name"
//                             label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                           >
//                             {pieChartData.map((entry, index) => (
//                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                             ))}
//                           </Pie>
//                           <Tooltip formatter={(value, name) => [`${value} posts`, name]} />
//                         </RechartsPieChart>
//                       </ResponsiveContainer>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               <Card className="border border-gray-100 bg-white lg:col-span-2">
//                 <CardHeader className="pb-2">
//                   <div className="flex justify-between items-center">
//                     <CardTitle className="text-sm font-medium flex items-center gap-2">
//                       <TrendingUp className="text-primary h-4 w-4" />
//                       Posts Over Time
//                     </CardTitle>
//                     <Badge variant="outline" className="text-xs font-normal">
//                       Monthly
//                     </Badge>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   {lineChartData.length === 0 ? (
//                     <div className="text-center py-8 text-muted-foreground text-sm">No timeline data available</div>
//                   ) : (
//                     <div className="h-[220px]">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
//                           <XAxis
//                             dataKey="month"
//                             stroke="#888"
//                             fontSize={11}
//                             tickLine={false}
//                             axisLine={{ stroke: "#f1f1f1" }}
//                           />
//                           <YAxis
//                             allowDecimals={false}
//                             stroke="#888"
//                             fontSize={11}
//                             tickLine={false}
//                             axisLine={{ stroke: "#f1f1f1" }}
//                           />
//                           <Tooltip
//                             contentStyle={{
//                               background: "#fff",
//                               border: "1px solid #f1f1f1",
//                               borderRadius: "4px",
//                               padding: "8px 12px",
//                               fontSize: "12px",
//                             }}
//                             cursor={{ stroke: "rgba(0, 0, 0, 0.08)", strokeWidth: 2 }}
//                           />
//                           <Line
//                             type="monotone"
//                             dataKey="count"
//                             stroke="hsl(var(--chart-1))"
//                             strokeWidth={3}
//                             dot={{ r: 4 }}
//                             activeDot={{ r: 6 }}
//                           />
//                         </LineChart>
//                       </ResponsiveContainer>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Summary Section - Enhanced */}
//             <Card className="border border-gray-100 bg-white">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium flex items-center gap-2">
//                   <Info className="text-primary h-4 w-4" />
//                   Quick Insights
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <div className="text-xs text-muted-foreground">Most Active Brand Kit</div>
//                     <div className="text-sm font-medium mt-1">
//                       {postsByBrand.length > 0 ? (
//                         <div className="flex items-center">
//                           {postsByBrand.sort((a, b) => b.count - a.count)[0].name}
//                           <Badge className="ml-2 bg-blue-100 text-blue-800">
//                             {postsByBrand.sort((a, b) => b.count - a.count)[0].count} posts
//                           </Badge>
//                         </div>
//                       ) : (
//                         "No data"
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-muted-foreground">Average Posts per Brand</div>
//                     <div className="text-sm font-medium mt-1">
//                       {brandKits.length > 0 ? (
//                         <div className="flex items-center">
//                           {(totalPosts / brandKits.length).toFixed(1)}
//                           <span className="text-xs text-muted-foreground ml-1">posts/brand</span>
//                         </div>
//                       ) : (
//                         "No data"
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-muted-foreground">Most Active Month</div>
//                     <div className="text-sm font-medium mt-1">
//                       {Object.keys(postsByMonth).length > 0 ? (
//                         <div className="flex items-center">
//                           {Object.entries(postsByMonth).sort((a, b) => b[1] - a[1])[0][0]}
//                           <Badge className="ml-2 bg-green-100 text-green-800">
//                             {Object.entries(postsByMonth).sort((a, b) => b[1] - a[1])[0][1]} posts
//                           </Badge>
//                         </div>
//                       ) : (
//                         "No data"
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="content">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
//               {/* Content Distribution by Day */}
//               <Card className="border border-gray-100 bg-white">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium flex items-center gap-2">
//                     <Calendar className="text-primary h-4 w-4" />
//                     Posts by Day of Week
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {barChartData.length === 0 ? (
//                     <div className="text-center py-8 text-muted-foreground text-sm">No day data available</div>
//                   ) : (
//                     <div className="h-[220px]">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <RechartBarChart data={barChartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
//                           <XAxis
//                             dataKey="day"
//                             stroke="#888"
//                             fontSize={11}
//                             tickLine={false}
//                             axisLine={{ stroke: "#f1f1f1" }}
//                           />
//                           <YAxis
//                             allowDecimals={false}
//                             stroke="#888"
//                             fontSize={11}
//                             tickLine={false}
//                             axisLine={{ stroke: "#f1f1f1" }}
//                           />
//                           <Tooltip
//                             contentStyle={{
//                               background: "#fff",
//                               border: "1px solid #f1f1f1",
//                               borderRadius: "4px",
//                               padding: "8px 12px",
//                               fontSize: "12px",
//                             }}
//                           />
//                           <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
//                         </RechartBarChart>
//                       </ResponsiveContainer>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* Brand Performance */}
//               <Card className="border border-gray-100 bg-white">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium flex items-center gap-2">
//                     <User className="text-primary h-4 w-4" />
//                     Brand Performance
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {postsByBrand.length === 0 ? (
//                     <div className="text-center py-4 text-muted-foreground text-sm">No brand data available</div>
//                   ) : (
//                     <ul className="space-y-2.5">
//                       {postsByBrand
//                         .sort((a, b) => b.count - a.count)
//                         .map((b, index) => (
//                           <li key={b.id}>
//                             <div className="flex justify-between items-center mb-1">
//                               <span className="text-sm text-gray-700">{b.name}</span>
//                               <span className="text-sm font-medium text-gray-700">{b.count}</span>
//                             </div>
//                             <div className="w-full bg-gray-100 rounded-full h-1.5">
//                               <div
//                                 className="h-full rounded-full"
//                                 style={{
//                                   width: `${Math.max(5, (b.count / Math.max(...postsByBrand.map((b) => b.count))) * 100)}%`,
//                                   backgroundColor: COLORS[index % COLORS.length],
//                                 }}
//                               />
//                             </div>
//                           </li>
//                         ))}
//                     </ul>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Content Insights */}
//             <Card className="border border-gray-100 bg-white mb-8">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium flex items-center gap-2">
//                   <Zap className="text-primary h-4 w-4" />
//                   Content Insights
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <div className="text-xs text-muted-foreground">Most Productive Day</div>
//                     <div className="text-sm font-medium mt-1">
//                       {barChartData.length > 0 ? (
//                         <div className="flex items-center">
//                           {barChartData.sort((a, b) => b.count - a.count)[0].day}
//                           <Badge className="ml-2 bg-purple-100 text-purple-800">
//                             {barChartData.sort((a, b) => b.count - a.count)[0].count} posts
//                           </Badge>
//                         </div>
//                       ) : (
//                         "No data"
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-muted-foreground">Least Used Brand</div>
//                     <div className="text-sm font-medium mt-1">
//                       {postsByBrand.length > 0 ? (
//                         <div className="flex items-center">
//                           {postsByBrand.filter((b) => b.count > 0).sort((a, b) => a.count - b.count)[0]?.name || "N/A"}
//                           <Badge className="ml-2 bg-orange-100 text-orange-800">
//                             {postsByBrand.filter((b) => b.count > 0).sort((a, b) => a.count - b.count)[0]?.count || 0}{" "}
//                             posts
//                           </Badge>
//                         </div>
//                       ) : (
//                         "No data"
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-muted-foreground">Content Consistency</div>
//                     <div className="text-sm font-medium mt-1">
//                       {Object.keys(postsByMonth).length > 0 ? (
//                         <div className="flex items-center">
//                           {Object.values(postsByMonth).length > 1 ? (
//                             <Badge
//                               className={`${
//                                 Math.max(...Object.values(postsByMonth)) / Math.min(...Object.values(postsByMonth)) < 2
//                                   ? "bg-green-100 text-green-800"
//                                   : "bg-yellow-100 text-yellow-800"
//                               }`}
//                             >
//                               {Math.max(...Object.values(postsByMonth)) / Math.min(...Object.values(postsByMonth)) < 2
//                                 ? "Consistent"
//                                 : "Variable"}
//                             </Badge>
//                           ) : (
//                             "Insufficient data"
//                           )}
//                         </div>
//                       ) : (
//                         "No data"
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Recent Content */}
//             <Card className="border border-gray-100 bg-white">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium flex items-center gap-2">
//                   <Clock className="text-primary h-4 w-4" />
//                   Recent Content
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {filteredPosts.length === 0 ? (
//                   <div className="text-center py-4 text-muted-foreground text-sm">No recent content available</div>
//                 ) : (
//                   <div className="space-y-3">
//                     {filteredPosts
//                       .sort((a, b) => new Date(b.updated_at || "").getTime() - new Date(a.updated_at || "").getTime())
//                       .slice(0, 8)
//                       .map((post) => {
//                         const brandKit = brandKits.find((b) => b.id === post.brand_kit_id)
//                         return (
//                           <div
//                             key={post.id}
//                             className="flex items-center justify-between p-2 rounded-md border border-gray-100"
//                           >
//                             <div className="flex items-center gap-3">
//                               <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
//                                 {post.image_url ? (
//                                   <img
//                                     src={post.image_url || "/placeholder.svg"}
//                                     alt="Post thumbnail"
//                                     className="w-full h-full object-cover"
//                                     onError={(e) => {
//                                       e.currentTarget.onerror = null
//                                       e.currentTarget.src = ""
//                                       if (e.currentTarget.parentElement) {
//                                         e.currentTarget.parentElement.innerHTML =
//                                           '<div class="flex items-center justify-center w-full h-full"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-gray-500"><path d="M2 16V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12"></path><path d="M2 22h20"></path><path d="M2 13.5V22h20V13.5"></path><path d="M18 2v4"></path><path d="M6 2v4"></path></svg></div>'
//                                       }
//                                     }}
//                                   />
//                                 ) : (
//                                   <Layers className="h-5 w-5 text-gray-500" />
//                                 )}
//                               </div>
//                               <div>
//                                 <div className="text-sm font-medium">
//                                   {post.caption
//                                     ? post.caption.length > 40
//                                       ? post.caption.substring(0, 40) + "..."
//                                       : post.caption
//                                     : `Post ${post.id.substring(0, 8)}`}
//                                 </div>
//                                 <div className="text-xs text-muted-foreground">
//                                   {brandKit?.name || "Unknown Brand"} •{" "}
//                                   {new Date(post.updated_at || "").toLocaleDateString()}
//                                 </div>
//                               </div>
//                             </div>
//                             {post.scheduled_for && (
//                               <Badge variant="outline" className="text-xs">
//                                 <Calendar className="h-3 w-3 mr-1" />
//                                 {new Date(post.scheduled_for).toLocaleDateString()}
//                               </Badge>
//                             )}
//                           </div>
//                         )
//                       })}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="performance">
//             {/* Performance Metrics */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//               <Card className="border border-gray-100 bg-white">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium flex items-center gap-2">
//                     <TrendingUp className="text-primary h-4 w-4" />
//                     Growth Rate
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {growthRate === null ? (
//                     <div className="text-center py-4 text-muted-foreground text-sm">Select a time period</div>
//                   ) : (
//                     <div className="flex flex-col items-center">
//                       <div className={`text-3xl font-semibold ${growthRate >= 0 ? "text-green-600" : "text-red-600"}`}>
//                         {growthRate >= 0 ? "+" : ""}
//                         {growthRate.toFixed(1)}%
//                       </div>
//                       <div className="text-xs text-muted-foreground mt-1">
//                         Compared to previous{" "}
//                         {timeRange === "7days" ? "week" : timeRange === "30days" ? "month" : "quarter"}
//                       </div>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               <Card className="border border-gray-100 bg-white">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium flex items-center gap-2">
//                     <Calendar className="text-primary h-4 w-4" />
//                     Content Frequency
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {filteredPosts.length === 0 ? (
//                     <div className="text-center py-4 text-muted-foreground text-sm">No data available</div>
//                   ) : (
//                     <div className="flex flex-col items-center">
//                       <div className="text-3xl font-semibold">
//                         {(
//                           filteredPosts.length /
//                           (timeRange === "7days"
//                             ? 7
//                             : timeRange === "30days"
//                               ? 30
//                               : timeRange === "90days"
//                                 ? 90
//                                 : Math.max(1, Object.keys(postsByMonth).length * 30))
//                         ).toFixed(1)}
//                       </div>
//                       <div className="text-xs text-muted-foreground mt-1">Posts per day on average</div>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               <Card className="border border-gray-100 bg-white">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium flex items-center gap-2">
//                     <Share2 className="text-primary h-4 w-4" />
//                     Brand Distribution
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {brandKits.length === 0 ? (
//                     <div className="text-center py-4 text-muted-foreground text-sm">No brands available</div>
//                   ) : (
//                     <div className="flex flex-col items-center">
//                       <div className="text-3xl font-semibold">
//                         {((postsByBrand.filter((b) => b.count > 0).length / brandKits.length) * 100).toFixed(0)}%
//                       </div>
//                       <div className="text-xs text-muted-foreground mt-1">Brand utilization rate</div>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Performance Recommendations */}
//             <Card className="border border-gray-100 bg-white mb-8">
//               <CardHeader>
//                 <CardTitle className="text-sm font-medium flex items-center gap-2">
//                   <Zap className="text-primary h-4 w-4" />
//                   Performance Recommendations
//                 </CardTitle>
//                 <CardDescription>Actionable insights to improve your content strategy</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {/* Dynamic recommendations based on data */}
//                   {brandKits.length > 0 && postsByBrand.some((b) => b.count === 0) && (
//                     <div className="flex items-start gap-3 p-3 rounded-md bg-blue-50">
//                       <div className="mt-0.5 bg-blue-100 rounded-full p-1">
//                         <Layers className="h-4 w-4 text-blue-700" />
//                       </div>
//                       <div>
//                         <h4 className="text-sm font-medium text-blue-900">Unused Brand Kits</h4>
//                         <p className="text-xs text-blue-700 mt-0.5">
//                           You have {postsByBrand.filter((b) => b.count === 0).length} unused brand kits. Consider
//                           creating content for these brands to maintain consistent brand presence.
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {barChartData.length > 0 && (
//                     <div className="flex items-start gap-3 p-3 rounded-md bg-purple-50">
//                       <div className="mt-0.5 bg-purple-100 rounded-full p-1">
//                         <Calendar className="h-4 w-4 text-purple-700" />
//                       </div>
//                       <div>
//                         <h4 className="text-sm font-medium text-purple-900">Optimize Posting Schedule</h4>
//                         <p className="text-xs text-purple-700 mt-0.5">
//                           Your most active day is {barChartData.sort((a, b) => b.count - a.count)[0].day}. Consider
//                           distributing content more evenly throughout the week for better engagement.
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {scheduledPostsCount === 0 && (
//                     <div className="flex items-start gap-3 p-3 rounded-md bg-amber-50">
//                       <div className="mt-0.5 bg-amber-100 rounded-full p-1">
//                         <Clock className="h-4 w-4 text-amber-700" />
//                       </div>
//                       <div>
//                         <h4 className="text-sm font-medium text-amber-900">Schedule Future Content</h4>
//                         <p className="text-xs text-amber-700 mt-0.5">
//                           You don't have any scheduled posts. Planning and scheduling content in advance can help
//                           maintain a consistent posting cadence.
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {growthRate !== null && growthRate < 0 && (
//                     <div className="flex items-start gap-3 p-3 rounded-md bg-red-50">
//                       <div className="mt-0.5 bg-red-100 rounded-full p-1">
//                         <TrendingUp className="h-4 w-4 text-red-700" />
//                       </div>
//                       <div>
//                         <h4 className="text-sm font-medium text-red-900">Content Production Declining</h4>
//                         <p className="text-xs text-red-700 mt-0.5">
//                           Your content production has decreased by {Math.abs(growthRate).toFixed(1)}% compared to the
//                           previous period. Consider setting a content calendar to maintain consistent output.
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Cost Analysis */}
//             <Card className="border border-gray-100 bg-white">
//               <CardHeader>
//                 <CardTitle className="text-sm font-medium flex items-center gap-2">
//                   <DollarSign className="text-primary h-4 w-4" />
//                   Cost Analysis
//                 </CardTitle>
//                 <CardDescription>Breakdown of your content production costs</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center p-3 rounded-md bg-gray-50">
//                     <div className="flex items-center gap-2">
//                       <div className="bg-gray-200 rounded-full p-1">
//                         <BarChart3 className="h-4 w-4 text-gray-700" />
//                       </div>
//                       <span className="text-sm font-medium">Cost per Post</span>
//                     </div>
//                     <span className="text-sm font-medium">$0.011</span>
//                   </div>

//                   <div className="flex justify-between items-center p-3 rounded-md bg-gray-50">
//                     <div className="flex items-center gap-2">
//                       <div className="bg-gray-200 rounded-full p-1">
//                         <DollarSign className="h-4 w-4 text-gray-700" />
//                       </div>
//                       <span className="text-sm font-medium">Total Cost</span>
//                     </div>
//                     <span className="text-sm font-medium">${personalCost.toFixed(2)}</span>
//                   </div>

//                   {timeRange !== "all" && (
//                     <div className="flex justify-between items-center p-3 rounded-md bg-gray-50">
//                       <div className="flex items-center gap-2">
//                         <div className="bg-gray-200 rounded-full p-1">
//                           <Calendar className="h-4 w-4 text-gray-700" />
//                         </div>
//                         <span className="text-sm font-medium">
//                           {timeRange === "7days" ? "Weekly" : timeRange === "30days" ? "Monthly" : "Quarterly"} Cost
//                         </span>
//                       </div>
//                       <span className="text-sm font-medium">${(totalPosts * 0.011).toFixed(2)}</span>
//                     </div>
//                   )}

//                   <div className="flex justify-between items-center p-3 rounded-md bg-gray-50">
//                     <div className="flex items-center gap-2">
//                       <div className="bg-gray-200 rounded-full p-1">
//                         <Layers className="h-4 w-4 text-gray-700" />
//                       </div>
//                       <span className="text-sm font-medium">Cost per Brand</span>
//                     </div>
//                     <span className="text-sm font-medium">
//                       ${brandKits.length > 0 ? (personalCost / brandKits.length).toFixed(2) : "0.00"}
//                     </span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* AI Feedback Tab */}
//           <TabsContent value="ai-feedback">
//             <div className="mb-6 flex items-center justify-between">
//               <div>
//                 <h2 className="text-lg font-semibold flex items-center gap-2">
//                   <BrainCircuit className="h-5 w-5 text-primary" />
//                   AI Content Analysis
//                 </h2>
//                 <p className="text-sm text-muted-foreground">
//                   Get AI-powered insights and recommendations for your content strategy
//                 </p>
//               </div>
//               <Button
//                 onClick={fetchAIFeedback}
//                 disabled={loadingAI || filteredPosts.length === 0}
//                 className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
//               >
//                 {loadingAI ? (
//                   <>
//                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     Analyzing...
//                   </>
//                 ) : (
//                   <>
//                     <Sparkles className="h-4 w-4 mr-2" />
//                     {aiFeedback ? "Refresh Analysis" : "Analyze Content"}
//                   </>
//                 )}
//               </Button>
//             </div>

//             {filteredPosts.length === 0 ? (
//               <Card className="border border-gray-100 bg-white mb-6">
//                 <CardContent className="flex flex-col items-center justify-center py-12">
//                   <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
//                   <h3 className="text-lg font-medium mb-2">No Content to Analyze</h3>
//                   <p className="text-center text-muted-foreground max-w-md">
//                     There are no posts available in the selected time period. Please create some content or select a
//                     different time range.
//                   </p>
//                 </CardContent>
//               </Card>
//             ) : !aiFeedback && !loadingAI ? (
//               <Card className="border border-gray-100 bg-white mb-6">
//                 <CardContent className="flex flex-col items-center justify-center py-12">
//                   <BrainCircuit className="h-12 w-12 text-primary/60 mb-4" />
//                   <h3 className="text-lg font-medium mb-2">AI Content Analysis</h3>
//                   <p className="text-center text-muted-foreground max-w-md mb-6">
//                     Get personalized recommendations to improve your content strategy based on AI analysis of your
//                     posts.
//                   </p>
//                   <Button
//                     onClick={fetchAIFeedback}
//                     className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
//                   >
//                     <Sparkles className="h-4 w-4 mr-2" />
//                     Analyze {filteredPosts.length} Posts
//                   </Button>
//                 </CardContent>
//               </Card>
//             ) : loadingAI ? (
//               <div className="space-y-6">
//                 <Card className="border border-gray-100 bg-white">
//                   <CardHeader>
//                     <Skeleton className="h-6 w-48" />
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <Skeleton className="h-4 w-full" />
//                     <Skeleton className="h-4 w-full" />
//                     <Skeleton className="h-4 w-3/4" />
//                   </CardContent>
//                 </Card>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Card className="border border-gray-100 bg-white">
//                     <CardHeader>
//                       <Skeleton className="h-6 w-40" />
//                     </CardHeader>
//                     <CardContent>
//                       <Skeleton className="h-4 w-full mb-2" />
//                       <Skeleton className="h-8 w-full mb-4" />
//                       <Skeleton className="h-4 w-full" />
//                       <Skeleton className="h-4 w-5/6" />
//                       <Skeleton className="h-4 w-4/6" />
//                     </CardContent>
//                   </Card>

//                   <Card className="border border-gray-100 bg-white">
//                     <CardHeader>
//                       <Skeleton className="h-6 w-40" />
//                     </CardHeader>
//                     <CardContent>
//                       <Skeleton className="h-4 w-full mb-2" />
//                       <Skeleton className="h-8 w-full mb-4" />
//                       <Skeleton className="h-4 w-full" />
//                       <Skeleton className="h-4 w-5/6" />
//                       <Skeleton className="h-4 w-4/6" />
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             ) : aiFeedback ? (
//               <div className="space-y-6">
//                 {/* Content Suggestions */}
//                 <Card className="border border-gray-100 bg-white">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Sparkles className="h-5 w-5 text-primary" />
//                       Content Improvement Suggestions
//                     </CardTitle>
//                     <CardDescription>AI-generated recommendations to enhance your content strategy</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {aiFeedback.contentSuggestions && aiFeedback.contentSuggestions.length > 0 ? (
//                       <ul className="space-y-3">
//                         {aiFeedback.contentSuggestions.map((item: string | { suggestion: string; rationale?: string; exampleImplementation?: string }, index: number) => {
//                           if (typeof item === "string") {
//                             return (
//                               <li key={index} className="flex gap-2">
//                                 <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
//                                 <span className="text-sm">{item}</span>
//                               </li>
//                             )
//                           } else if (isAISuggestionObject(item)) {
//                             return (
//                               <li key={index} className="flex flex-col gap-1 mb-2">
//                                 <div className="flex gap-2 items-center">
//                                   <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
//                                   <span className="text-sm font-semibold">{item.suggestion}</span>
//                                 </div>
//                                 <div className="ml-7 text-xs text-muted-foreground">
//                                   {item.rationale && <><strong>Why:</strong> {item.rationale}<br /></>}
//                                   {item.exampleImplementation && <><strong>Example:</strong> {item.exampleImplementation}</>}
//                                 </div>
//                               </li>
//                             )
//                           } else {
//                             return null
//                           }
//                         })}
//                       </ul>
//                     ) : (
//                       <p className="text-muted-foreground text-sm">No content suggestions available.</p>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Brand Consistency and Caption Quality */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Brand Consistency */}
//                   <Card className="border border-gray-100 bg-white">
//                     <CardHeader>
//                       <CardTitle className="flex items-center gap-2">
//                         <Layers className="h-5 w-5 text-primary" />
//                         Brand Consistency
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="mb-4">
//                         <div className="flex justify-between items-center mb-2">
//                           <span className="text-sm font-medium">Score</span>
//                           <span className="text-sm font-bold">{aiFeedback.brandConsistency?.score || 0}/10</span>
//                         </div>
//                         <Progress
//                           value={(aiFeedback.brandConsistency?.score || 0) * 10}
//                           className={`h-2 ${
//                             (aiFeedback.brandConsistency?.score || 0) >= 7
//                               ? "bg-gray-100 [&>div]:bg-green-500"
//                               : (aiFeedback.brandConsistency?.score || 0) >= 4
//                                 ? "bg-gray-100 [&>div]:bg-amber-500"
//                                 : "bg-gray-100 [&>div]:bg-red-500"
//                           }`}
//                         />
//                       </div>
//                       <div className="p-3 rounded-md bg-gray-50">
//                         <h4 className="text-sm font-medium mb-1">Feedback</h4>
//                         <p className="text-sm text-muted-foreground">
//                           {aiFeedback.brandConsistency?.feedback || "No feedback available."}
//                         </p>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   {/* Caption Quality */}
//                   <Card className="border border-gray-100 bg-white">
//                     <CardHeader>
//                       <CardTitle className="flex items-center gap-2">
//                         <MessageSquare className="h-5 w-5 text-primary" />
//                         Caption Quality
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="mb-4">
//                         <div className="flex justify-between items-center mb-2">
//                           <span className="text-sm font-medium">Score</span>
//                           <span className="text-sm font-bold">{aiFeedback.captionQuality?.score || 0}/10</span>
//                         </div>
//                         <Progress
//                           value={(aiFeedback.captionQuality?.score || 0) * 10}
//                           className={`h-2 ${
//                             (aiFeedback.captionQuality?.score || 0) >= 7
//                               ? "bg-gray-100 [&>div]:bg-green-500"
//                               : (aiFeedback.captionQuality?.score || 0) >= 4
//                                 ? "bg-gray-100 [&>div]:bg-amber-500"
//                                 : "bg-gray-100 [&>div]:bg-red-500"
//                           }`}
//                         />
//                       </div>
//                       <div className="p-3 rounded-md bg-gray-50">
//                         <h4 className="text-sm font-medium mb-1">Feedback</h4>
//                         <p className="text-sm text-muted-foreground">
//                           {aiFeedback.captionQuality?.feedback || "No feedback available."}
//                         </p>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>

//                 {/* Overall Strategy */}
//                 <Card className="border border-gray-100 bg-white">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <LineChartIcon className="h-5 w-5 text-primary" />
//                       Overall Content Strategy
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="p-4 rounded-md bg-gradient-to-r from-purple-50 to-indigo-50 border border-indigo-100">
//                       <div className="flex items-start gap-3">
//                         <BrainCircuit className="h-5 w-5 text-indigo-600 mt-1" />
//                         <div>
//                           <h4 className="text-sm font-medium text-indigo-900 mb-1">Strategic Recommendation</h4>
//                           <p className="text-sm text-indigo-700">
//                             {aiFeedback.overallStrategy || "No strategic recommendation available."}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Brand Kit Optimization */}
//                 {aiFeedback?.brandKitOptimizations && (
//                   <Card className="border border-gray-100 bg-white">
//                     <CardHeader>
//                       <CardTitle className="flex items-center gap-2">
//                         <Palette className="h-5 w-5 text-primary" />
//                         Brand Kit Optimization
//                       </CardTitle>
//                       <CardDescription>
//                         Suggestions to improve your brand kits for better AI-generated content
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         {aiFeedback.brandKitOptimizations.nameRecommendations && (
//                           <div className="p-3 rounded-md bg-blue-50 border border-blue-100">
//                             <h4 className="text-sm font-medium text-blue-900 mb-1">Brand Name Recommendations</h4>
//                             <p className="text-sm text-blue-800">
//                               {aiFeedback.brandKitOptimizations.nameRecommendations}
//                             </p>
//                           </div>
//                         )}

//                         {aiFeedback.brandKitOptimizations.descriptionRecommendations && (
//                           <div className="p-3 rounded-md bg-purple-50 border border-purple-100">
//                             <h4 className="text-sm font-medium text-purple-900 mb-1">Description Improvements</h4>
//                             <p className="text-sm text-purple-800">
//                               {aiFeedback.brandKitOptimizations.descriptionRecommendations}
//                             </p>
//                           </div>
//                         )}

//                         {aiFeedback.brandKitOptimizations.toneRecommendations && (
//                           <div className="p-3 rounded-md bg-amber-50 border border-amber-100">
//                             <h4 className="text-sm font-medium text-amber-900 mb-1">Tone Specification</h4>
//                             <p className="text-sm text-amber-800">
//                               {aiFeedback.brandKitOptimizations.toneRecommendations}
//                             </p>
//                           </div>
//                         )}

//                         {aiFeedback.brandKitOptimizations.colorRecommendations && (
//                           <div className="p-3 rounded-md bg-green-50 border border-green-100">
//                             <h4 className="text-sm font-medium text-green-900 mb-1">Color Palette Suggestions</h4>
//                             <p className="text-sm text-green-800">
//                               {aiFeedback.brandKitOptimizations.colorRecommendations}
//                             </p>
//                           </div>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )}
//               </div>
//             ) : null}
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import type { Post, BrandKit } from "@/lib/supabase/database.types"
import {
  Loader2,
  Info,
  Calendar,
  DollarSign,
  Layers,
  BarChart3,
  User,
  Download,
  TrendingUp,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Share2,
  PieChart,
  Clock,
  Zap,
  Sparkles,
  BrainCircuit,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  LineChartIcon,
  Palette,
  History,
  ChevronDown,
} from "lucide-react"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { DotPattern } from "@/components/magicui/dot-pattern"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { generateAIFeedback, getPastAnalytics, type AIFeedbackResponse } from "@/lib/actions/ai-feedback"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { format } from "date-fns"

export default function AnalyticsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [brandKits, setBrandKits] = useState<BrandKit[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scheduledPostsCount, setScheduledPostsCount] = useState<number>(0)
  const [personalCost, setPersonalCost] = useState<number>(0)
  const [user, setUser] = useState<any>(null)
  const [timeRange, setTimeRange] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [aiFeedback, setAiFeedback] = useState<AIFeedbackResponse | null>(null)
  const [loadingAI, setLoadingAI] = useState<boolean>(false)
  const [pastAnalytics, setPastAnalytics] = useState<AIFeedbackResponse[]>([])
  const [loadingPastAnalytics, setLoadingPastAnalytics] = useState<boolean>(false)
  const { toast } = useToast()

  // Helper: filter out posts with valid updated_at
  function isValidDate(dateString: string | null | undefined) {
    if (!dateString) return false
    const d = new Date(dateString)
    return d instanceof Date && !isNaN(d.getTime()) && d.getFullYear() > 2000
  }

  async function fetchData(showRefreshIndicator = false) {
    if (showRefreshIndicator) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setError("Not authenticated")
        setLoading(false)
        setRefreshing(false)
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

        if (showRefreshIndicator) {
          toast({
            title: "Analytics refreshed",
            description: "Your analytics data has been updated",
          })
        }
      }
    } catch (e: any) {
      setError(e.message)
    }

    setLoading(false)
    setRefreshing(false)
  }

  async function fetchAIFeedback() {
    setLoadingAI(true)
    try {
      const feedback = await generateAIFeedback(timeRange)
      setAiFeedback(feedback)

      if (feedback.error) {
        toast({
          title: "AI Feedback Error",
          description: feedback.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "AI Analysis Complete",
          description: "Your content has been analyzed successfully",
        })

        // Refresh past analytics after generating new feedback
        fetchPastAnalytics()
      }
    } catch (error: any) {
      toast({
        title: "AI Feedback Error",
        description: error.message || "Failed to generate AI feedback",
        variant: "destructive",
      })
    } finally {
      setLoadingAI(false)
    }
  }

  async function fetchPastAnalytics() {
    setLoadingPastAnalytics(true)
    try {
      const analytics = await getPastAnalytics(5)
      setPastAnalytics(analytics)
    } catch (error) {
      console.error("Error fetching past analytics:", error)
    } finally {
      setLoadingPastAnalytics(false)
    }
  }

  useEffect(() => {
    fetchData()
    fetchPastAnalytics()
  }, [])

  // Reset AI feedback when time range changes
  useEffect(() => {
    setAiFeedback(null)
  }, [timeRange])

  // Filter posts based on selected time range
  const getFilteredPosts = () => {
    const validPosts = posts.filter((p) => isValidDate(p.updated_at))

    if (timeRange === "all") {
      return validPosts
    }

    const now = new Date()
    const cutoffDate = new Date()

    switch (timeRange) {
      case "7days":
        cutoffDate.setDate(now.getDate() - 7)
        break
      case "30days":
        cutoffDate.setDate(now.getDate() - 30)
        break
      case "90days":
        cutoffDate.setDate(now.getDate() - 90)
        break
      default:
        return validPosts
    }

    return validPosts.filter((post) => {
      const postDate = new Date(post.updated_at || "")
      return postDate >= cutoffDate
    })
  }

  const filteredPosts = getFilteredPosts()

  // Analytics calculations
  const totalPosts = filteredPosts.length
  const postsByBrand = brandKits.map((kit) => ({
    id: kit.id,
    name: kit.name,
    count: filteredPosts.filter((p) => p.brand_kit_id === kit.id).length,
    value: filteredPosts.filter((p) => p.brand_kit_id === kit.id).length,
  }))

  // Calculate growth rate
  const calculateGrowth = () => {
    if (timeRange === "all" || filteredPosts.length === 0) return null

    const now = new Date()
    const previousCutoff = new Date()
    const currentCutoff = new Date()

    switch (timeRange) {
      case "7days":
        previousCutoff.setDate(now.getDate() - 14)
        currentCutoff.setDate(now.getDate() - 7)
        break
      case "30days":
        previousCutoff.setDate(now.getDate() - 60)
        currentCutoff.setDate(now.getDate() - 30)
        break
      case "90days":
        previousCutoff.setDate(now.getDate() - 180)
        currentCutoff.setDate(now.getDate() - 90)
        break
      default:
        return null
    }

    const currentPeriodPosts = filteredPosts.filter((post) => {
      const postDate = new Date(post.updated_at || "")
      return postDate >= currentCutoff
    }).length

    const previousPeriodPosts = posts.filter((post) => {
      const postDate = new Date(post.updated_at || "")
      return postDate >= previousCutoff && postDate < currentCutoff
    }).length

    if (previousPeriodPosts === 0) return currentPeriodPosts > 0 ? 100 : 0

    return ((currentPeriodPosts - previousPeriodPosts) / previousPeriodPosts) * 100
  }

  const growthRate = calculateGrowth()

  // Posts by month
  const postsByMonth = filteredPosts.reduce(
    (acc, post) => {
      const month = new Date(post.updated_at || "").toLocaleString("default", { month: "short", year: "numeric" })
      acc[month] = (acc[month] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Posts by day of week
  const postsByDayOfWeek = filteredPosts.reduce(
    (acc, post) => {
      const dayOfWeek = new Date(post.updated_at || "").toLocaleString("default", { weekday: "short" })
      acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Format data for charts
  const lineChartData = Object.entries(postsByMonth)
    .map(([month, count]) => ({ month, count: Number(count) }))
    .sort((a, b) => {
      const [aMonth, aYear] = a.month.split(" ")
      const [bMonth, bYear] = b.month.split(" ")
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      if (aYear !== bYear) return Number(aYear) - Number(bYear)
      return months.indexOf(aMonth) - months.indexOf(bMonth)
    })

  const barChartData = Object.entries(postsByDayOfWeek)
    .map(([day, count]) => ({ day, count: Number(count) }))
    .sort((a, b) => {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      return days.indexOf(a.day) - days.indexOf(b.day)
    })

  const pieChartData = postsByBrand.filter((brand) => brand.count > 0)
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

  // Export analytics data as CSV
  const exportAnalytics = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,"

    // Headers
    csvContent += "Category,Metric,Value\n"

    // Add main metrics
    csvContent += `Overview,Total Posts,${totalPosts}\n`
    csvContent += `Overview,Brand Kits,${brandKits.length}\n`
    csvContent += `Overview,Personal Cost,$${personalCost.toFixed(2)}\n`
    csvContent += `Overview,Scheduled Posts,${scheduledPostsCount}\n`

    // Add posts by brand
    postsByBrand.forEach((brand) => {
      csvContent += `Brand Distribution,${brand.name},${brand.count}\n`
    })

    // Add posts by month
    Object.entries(postsByMonth).forEach(([month, count]) => {
      csvContent += `Monthly Distribution,${month},${count}\n`
    })

    // Create download link
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `analytics_export_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)

    // Trigger download
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export successful",
      description: "Your analytics data has been exported as CSV",
    })
  }

  if (loading) {
    return (
      <div className="relative min-h-screen bg-white">
        <DotPattern
          className="absolute inset-0 z-0 opacity-20 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
          width={24}
          height={24}
        />
        <div className="relative z-10 container mx-auto px-4 py-5 max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border border-gray-100 bg-white">
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-40" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <Skeleton className="h-[300px] rounded-lg" />
            <Skeleton className="h-[300px] lg:col-span-2 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-destructive text-lg mb-2">Error loading analytics</div>
        <p className="text-muted-foreground">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => fetchData()}>
          Try Again
        </Button>
      </div>
    )
  }

  // Function to render AI feedback content
  const renderAIFeedbackContent = (feedback: AIFeedbackResponse, isHistorical = false) => (
    <div className="space-y-6">
      {/* Content Suggestions */}
      <Card className={`border border-gray-100 bg-white ${isHistorical ? "opacity-90" : ""}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Content Improvement Suggestions
          </CardTitle>
          <CardDescription>AI-generated recommendations to enhance your content strategy</CardDescription>
        </CardHeader>
        <CardContent>
          {feedback.contentSuggestions && feedback.contentSuggestions.length > 0 ? (
            <ul className="space-y-3">
              {feedback.contentSuggestions.map((suggestion, index) => (
                <li key={index} className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{suggestion}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">No content suggestions available.</p>
          )}
        </CardContent>
      </Card>

      {/* Brand Consistency and Caption Quality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Brand Consistency */}
        <Card className={`border border-gray-100 bg-white ${isHistorical ? "opacity-90" : ""}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Brand Consistency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Score</span>
                <span className="text-sm font-bold">{feedback.brandConsistency?.score || 0}/10</span>
              </div>
              <Progress
                value={(feedback.brandConsistency?.score || 0) * 10}
                className={`h-2 ${
                  (feedback.brandConsistency?.score || 0) >= 7
                    ? "bg-gray-100 [&>div]:bg-green-500"
                    : (feedback.brandConsistency?.score || 0) >= 4
                      ? "bg-gray-100 [&>div]:bg-amber-500"
                      : "bg-gray-100 [&>div]:bg-red-500"
                }`}
              />
            </div>
            <div className="p-3 rounded-md bg-gray-50">
              <h4 className="text-sm font-medium mb-1">Feedback</h4>
              <p className="text-sm text-muted-foreground">
                {feedback.brandConsistency?.feedback || "No feedback available."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Caption Quality */}
        <Card className={`border border-gray-100 bg-white ${isHistorical ? "opacity-90" : ""}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Caption Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Score</span>
                <span className="text-sm font-bold">{feedback.captionQuality?.score || 0}/10</span>
              </div>
              <Progress
                value={(feedback.captionQuality?.score || 0) * 10}
                className={`h-2 ${
                  (feedback.captionQuality?.score || 0) >= 7
                    ? "bg-gray-100 [&>div]:bg-green-500"
                    : (feedback.captionQuality?.score || 0) >= 4
                      ? "bg-gray-100 [&>div]:bg-amber-500"
                      : "bg-gray-100 [&>div]:bg-red-500"
                }`}
              />
            </div>
            <div className="p-3 rounded-md bg-gray-50">
              <h4 className="text-sm font-medium mb-1">Feedback</h4>
              <p className="text-sm text-muted-foreground">
                {feedback.captionQuality?.feedback || "No feedback available."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Strategy */}
      <Card className={`border border-gray-100 bg-white ${isHistorical ? "opacity-90" : ""}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChartIcon className="h-5 w-5 text-primary" />
            Overall Content Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-md bg-gradient-to-r from-purple-50 to-indigo-50 border border-indigo-100">
            <div className="flex items-start gap-3">
              <BrainCircuit className="h-5 w-5 text-indigo-600 mt-1" />
              <div>
                <h4 className="text-sm font-medium text-indigo-900 mb-1">Strategic Recommendation</h4>
                <p className="text-sm text-indigo-700">
                  {feedback.overallStrategy || "No strategic recommendation available."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brand Kit Optimization */}
      {feedback?.brandKitOptimizations && (
        <Card className={`border border-gray-100 bg-white ${isHistorical ? "opacity-90" : ""}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Brand Kit Optimization
            </CardTitle>
            <CardDescription>Suggestions to improve your brand kits for better AI-generated content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feedback.brandKitOptimizations.nameRecommendations && (
                <div className="p-3 rounded-md bg-blue-50 border border-blue-100">
                  <h4 className="text-sm font-medium text-blue-900 mb-1">Brand Name Recommendations</h4>
                  <p className="text-sm text-blue-800">{feedback.brandKitOptimizations.nameRecommendations}</p>
                </div>
              )}

              {feedback.brandKitOptimizations.descriptionRecommendations && (
                <div className="p-3 rounded-md bg-purple-50 border border-purple-100">
                  <h4 className="text-sm font-medium text-purple-900 mb-1">Description Improvements</h4>
                  <p className="text-sm text-purple-800">{feedback.brandKitOptimizations.descriptionRecommendations}</p>
                </div>
              )}

              {feedback.brandKitOptimizations.toneRecommendations && (
                <div className="p-3 rounded-md bg-amber-50 border border-amber-100">
                  <h4 className="text-sm font-medium text-amber-900 mb-1">Tone Specification</h4>
                  <p className="text-sm text-amber-800">{feedback.brandKitOptimizations.toneRecommendations}</p>
                </div>
              )}

              {feedback.brandKitOptimizations.colorRecommendations && (
                <div className="p-3 rounded-md bg-green-50 border border-green-100">
                  <h4 className="text-sm font-medium text-green-900 mb-1">Color Palette Suggestions</h4>
                  <p className="text-sm text-green-800">{feedback.brandKitOptimizations.colorRecommendations}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  return (
    <div className="relative min-h-screen bg-white">
      {/* Subtle dot pattern background */}
      <DotPattern
        className="absolute inset-0 z-0 opacity-20 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
        width={24}
        height={24}
      />

      <div className="relative z-10 container mx-auto px-4 py-5 max-w-6xl">
        {/* Header with controls */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground text-sm">Track your content performance and insights</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="h-9" onClick={() => fetchData(true)} disabled={refreshing}>
              {refreshing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Refresh
                </>
              )}
            </Button>

            <Button variant="outline" size="sm" className="h-9" onClick={exportAnalytics}>
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export
            </Button>
          </div>
        </div>

        {/* Tabs for different analytics views */}
        <Tabs defaultValue="overview" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content Analysis</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="ai-feedback">AI Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Main metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="border border-gray-100 bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="text-primary h-4 w-4" />
                    Total Posts
                  </CardTitle>
                  <Badge variant="outline" className="text-xs font-normal">
                    {timeRange === "all"
                      ? "All Time"
                      : timeRange === "7days"
                        ? "7 Days"
                        : timeRange === "30days"
                          ? "30 Days"
                          : "90 Days"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <NumberTicker value={totalPosts} className="text-3xl font-semibold text-gray-900" />
                    {growthRate !== null && (
                      <Badge
                        className={`ml-2 ${growthRate >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {growthRate >= 0 ? (
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(growthRate).toFixed(1)}%
                      </Badge>
                    )}
                  </div>
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
                    <PieChart className="text-primary h-4 w-4" />
                    Posts by Brand
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pieChartData.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground text-sm">No brand data available</div>
                  ) : (
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value, name) => [`${value} posts`, name]} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-gray-100 bg-white lg:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="text-primary h-4 w-4" />
                      Posts Over Time
                    </CardTitle>
                    <Badge variant="outline" className="text-xs font-normal">
                      Monthly
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {lineChartData.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">No timeline data available</div>
                  ) : (
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
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
                            }}
                            cursor={{ stroke: "rgba(0, 0, 0, 0.08)", strokeWidth: 2 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="hsl(var(--chart-1))"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Summary Section - Enhanced */}
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
                      {postsByBrand.length > 0 ? (
                        <div className="flex items-center">
                          {postsByBrand.sort((a, b) => b.count - a.count)[0].name}
                          <Badge className="ml-2 bg-blue-100 text-blue-800">
                            {postsByBrand.sort((a, b) => b.count - a.count)[0].count} posts
                          </Badge>
                        </div>
                      ) : (
                        "No data"
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Average Posts per Brand</div>
                    <div className="text-sm font-medium mt-1">
                      {brandKits.length > 0 ? (
                        <div className="flex items-center">
                          {(totalPosts / brandKits.length).toFixed(1)}
                          <span className="text-xs text-muted-foreground ml-1">posts/brand</span>
                        </div>
                      ) : (
                        "No data"
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Most Active Month</div>
                    <div className="text-sm font-medium mt-1">
                      {Object.keys(postsByMonth).length > 0 ? (
                        <div className="flex items-center">
                          {Object.entries(postsByMonth).sort((a, b) => b[1] - a[1])[0][0]}
                          <Badge className="ml-2 bg-green-100 text-green-800">
                            {Object.entries(postsByMonth).sort((a, b) => b[1] - a[1])[0][1]} posts
                          </Badge>
                        </div>
                      ) : (
                        "No data"
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              {/* Content Distribution by Day */}
              <Card className="border border-gray-100 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="text-primary h-4 w-4" />
                    Posts by Day of Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {barChartData.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">No day data available</div>
                  ) : (
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartBarChart data={barChartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                          <XAxis
                            dataKey="day"
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
                            }}
                          />
                          <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                        </RechartBarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Brand Performance */}
              <Card className="border border-gray-100 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <User className="text-primary h-4 w-4" />
                    Brand Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {postsByBrand.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground text-sm">No brand data available</div>
                  ) : (
                    <ul className="space-y-2.5">
                      {postsByBrand
                        .sort((a, b) => b.count - a.count)
                        .map((b, index) => (
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
                                  backgroundColor: COLORS[index % COLORS.length],
                                }}
                              />
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Content Insights */}
            <Card className="border border-gray-100 bg-white mb-8">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="text-primary h-4 w-4" />
                  Content Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Most Productive Day</div>
                    <div className="text-sm font-medium mt-1">
                      {barChartData.length > 0 ? (
                        <div className="flex items-center">
                          {barChartData.sort((a, b) => b.count - a.count)[0].day}
                          <Badge className="ml-2 bg-purple-100 text-purple-800">
                            {barChartData.sort((a, b) => b.count - a.count)[0].count} posts
                          </Badge>
                        </div>
                      ) : (
                        "No data"
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Least Used Brand</div>
                    <div className="text-sm font-medium mt-1">
                      {postsByBrand.length > 0 ? (
                        <div className="flex items-center">
                          {postsByBrand.filter((b) => b.count > 0).sort((a, b) => a.count - b.count)[0]?.name || "N/A"}
                          <Badge className="ml-2 bg-orange-100 text-orange-800">
                            {postsByBrand.filter((b) => b.count > 0).sort((a, b) => a.count - b.count)[0]?.count || 0}{" "}
                            posts
                          </Badge>
                        </div>
                      ) : (
                        "No data"
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Content Consistency</div>
                    <div className="text-sm font-medium mt-1">
                      {Object.keys(postsByMonth).length > 0 ? (
                        <div className="flex items-center">
                          {Object.values(postsByMonth).length > 1 ? (
                            <Badge
                              className={`${
                                Math.max(...Object.values(postsByMonth)) / Math.min(...Object.values(postsByMonth)) < 2
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {Math.max(...Object.values(postsByMonth)) / Math.min(...Object.values(postsByMonth)) < 2
                                ? "Consistent"
                                : "Variable"}
                            </Badge>
                          ) : (
                            "Insufficient data"
                          )}
                        </div>
                      ) : (
                        "No data"
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Content */}
            <Card className="border border-gray-100 bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="text-primary h-4 w-4" />
                  Recent Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">No recent content available</div>
                ) : (
                  <div className="space-y-3">
                    {filteredPosts
                      .sort((a, b) => new Date(b.updated_at || "").getTime() - new Date(a.updated_at || "").getTime())
                      .slice(0, 8)
                      .map((post) => {
                        const brandKit = brandKits.find((b) => b.id === post.brand_kit_id)
                        return (
                          <div
                            key={post.id}
                            className="flex items-center justify-between p-2 rounded-md border border-gray-100"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                                {post.image_url ? (
                                  <img
                                    src={post.image_url || "/placeholder.svg"}
                                    alt="Post thumbnail"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.onerror = null
                                      e.currentTarget.src = ""
                                      e.currentTarget.parentElement.innerHTML =
                                        '<div class="flex items-center justify-center w-full h-full"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-gray-500"><path d="M2 16V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12"></path><path d="M2 22h20"></path><path d="M2 13.5V22h20V13.5"></path><path d="M18 2v4"></path><path d="M6 2v4"></path></svg></div>'
                                    }}
                                  />
                                ) : (
                                  <Layers className="h-5 w-5 text-gray-500" />
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium">
                                  {post.caption
                                    ? post.caption.length > 40
                                      ? post.caption.substring(0, 40) + "..."
                                      : post.caption
                                    : `Post ${post.id.substring(0, 8)}`}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {brandKit?.name || "Unknown Brand"} •{" "}
                                  {new Date(post.updated_at || "").toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            {post.scheduled_for && (
                              <Badge variant="outline" className="text-xs">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(post.scheduled_for).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                        )
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="border border-gray-100 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="text-primary h-4 w-4" />
                    Growth Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {growthRate === null ? (
                    <div className="text-center py-4 text-muted-foreground text-sm">Select a time period</div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className={`text-3xl font-semibold ${growthRate >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {growthRate >= 0 ? "+" : ""}
                        {growthRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Compared to previous{" "}
                        {timeRange === "7days" ? "week" : timeRange === "30days" ? "month" : "quarter"}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-gray-100 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="text-primary h-4 w-4" />
                    Content Frequency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredPosts.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground text-sm">No data available</div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="text-3xl font-semibold">
                        {(
                          filteredPosts.length /
                          (timeRange === "7days"
                            ? 7
                            : timeRange === "30days"
                              ? 30
                              : timeRange === "90days"
                                ? 90
                                : Math.max(1, Object.keys(postsByMonth).length * 30))
                        ).toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Posts per day on average</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-gray-100 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Share2 className="text-primary h-4 w-4" />
                    Brand Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {brandKits.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground text-sm">No brands available</div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="text-3xl font-semibold">
                        {((postsByBrand.filter((b) => b.count > 0).length / brandKits.length) * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Brand utilization rate</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Performance Recommendations */}
            <Card className="border border-gray-100 bg-white mb-8">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="text-primary h-4 w-4" />
                  Performance Recommendations
                </CardTitle>
                <CardDescription>Actionable insights to improve your content strategy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Dynamic recommendations based on data */}
                  {brandKits.length > 0 && postsByBrand.some((b) => b.count === 0) && (
                    <div className="flex items-start gap-3 p-3 rounded-md bg-blue-50">
                      <div className="mt-0.5 bg-blue-100 rounded-full p-1">
                        <Layers className="h-4 w-4 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-blue-900">Unused Brand Kits</h4>
                        <p className="text-xs text-blue-700 mt-0.5">
                          You have {postsByBrand.filter((b) => b.count === 0).length} unused brand kits. Consider
                          creating content for these brands to maintain consistent brand presence.
                        </p>
                      </div>
                    </div>
                  )}

                  {barChartData.length > 0 && (
                    <div className="flex items-start gap-3 p-3 rounded-md bg-purple-50">
                      <div className="mt-0.5 bg-purple-100 rounded-full p-1">
                        <Calendar className="h-4 w-4 text-purple-700" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-purple-900">Posting Schedule</h4>
                        <p className="text-xs text-purple-700 mt-0.5">
                          Your most active day is{" "}
                          {barChartData.length > 0 ? barChartData.sort((a, b) => b.count - a.count)[0].day : "unknown"}.
                          Consider spreading content more evenly throughout the week for better engagement.
                        </p>
                      </div>
                    </div>
                  )}

                  {growthRate !== null && growthRate < 0 && (
                    <div className="flex items-start gap-3 p-3 rounded-md bg-amber-50">
                      <div className="mt-0.5 bg-amber-100 rounded-full p-1">
                        <AlertCircle className="h-4 w-4 text-amber-700" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-amber-900">Declining Growth</h4>
                        <p className="text-xs text-amber-700 mt-0.5">
                          Your content production has decreased by {Math.abs(growthRate).toFixed(1)}% compared to the
                          previous period. Consider setting a content calendar to maintain consistency.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-3 rounded-md bg-green-50">
                    <div className="mt-0.5 bg-green-100 rounded-full p-1">
                      <Sparkles className="h-4 w-4 text-green-700" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-green-900">AI Feedback</h4>
                      <p className="text-xs text-green-700 mt-0.5">
                        Use the AI Feedback tab to get personalized recommendations for improving your content strategy
                        and brand kit optimization.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-feedback">
            <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold">AI Content Analysis</h2>
                <p className="text-sm text-muted-foreground">
                  Get AI-powered insights and recommendations for your content strategy
                </p>
              </div>
              <Button
                onClick={fetchAIFeedback}
                disabled={loadingAI}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
              >
                {loadingAI ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Content...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    Generate AI Feedback
                  </>
                )}
              </Button>
            </div>

            {/* AI Feedback Content */}
            {aiFeedback ? (
              <div className="mb-8">{renderAIFeedbackContent(aiFeedback)}</div>
            ) : (
              <Card className="border border-gray-100 bg-white mb-8">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="bg-indigo-50 p-3 rounded-full mb-4">
                    <BrainCircuit className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No AI Analysis Yet</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                    Generate AI feedback to get personalized insights about your content strategy and brand kit
                    optimization.
                  </p>
                  <Button
                    onClick={fetchAIFeedback}
                    disabled={loadingAI}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
                  >
                    {loadingAI ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing Content...
                      </>
                    ) : (
                      <>
                        <BrainCircuit className="mr-2 h-4 w-4" />
                        Generate AI Feedback
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Historical Analytics */}
            <div className="mb-4">
              <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-primary" />
                Analytics History
              </h3>

              {loadingPastAnalytics ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="border border-gray-100 bg-white">
                      <CardHeader>
                        <Skeleton className="h-6 w-48" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-24 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : pastAnalytics.length === 0 ? (
                <Card className="border border-gray-100 bg-white">
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No analytics history available yet.</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Generate AI feedback to start building your analytics history.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pastAnalytics.map((feedback, index) => (
                    <Collapsible key={feedback.id || index} className="border border-gray-100 rounded-lg bg-white">
                      <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left">
                        <div className="flex items-center gap-2">
                          <div className="bg-indigo-50 p-1.5 rounded-full">
                            <BrainCircuit className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div>
                            <div className="font-medium">
                              Analysis from{" "}
                              {feedback.created_at
                                ? format(new Date(feedback.created_at), "MMM d, yyyy")
                                : "Unknown date"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Brand Consistency: {feedback.brandConsistency?.score || 0}/10 • Caption Quality:{" "}
                              {feedback.captionQuality?.score || 0}/10
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-4 pb-4">{renderAIFeedbackContent(feedback, true)}</div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              )}
            </div>

            {/* AI Feedback Cost Information */}
            <Card className="border border-gray-100 bg-white mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  AI Feedback Cost
                </CardTitle>
                <CardDescription>Information about AI feedback credit usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-md bg-gray-50 border border-gray-200">
                  <h4 className="text-sm font-medium mb-2">Cost per Analysis</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Each AI feedback analysis costs <strong>1 credit</strong> from your plan's AI feedback allocation.
                  </p>

                  <h4 className="text-sm font-medium mb-2">Credit Usage</h4>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Used Credits</span>
                    <span className="text-sm font-medium">{pastAnalytics.length}</span>
                  </div>
                  <Progress value={pastAnalytics.length * 10} className="h-2 mb-4" />

                  <div className="text-xs text-muted-foreground">
                    <p>• AI feedback analyses are stored for future reference</p>
                    <p>• You can view historical analyses in the Analytics History section</p>
                    <p>
                      • Each analysis provides brand consistency scores, caption quality assessment, and optimization
                      suggestions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
