// "use client"

// import { useState, useEffect } from "react"
// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { ChevronLeft, ChevronRight, Calendar, Plus, Instagram, Edit2, Trash2, Clock, Loader2 } from "lucide-react"
// import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
// import { createClient } from "@/lib/supabase/client"
// import type { Post, BrandKit } from "@/lib/supabase/database.types"
// import { getBrandKits } from "@/lib/actions/brand-kits"
// import { getPosts } from "@/lib/actions/posts"
// import { Input } from "@/components/ui/input"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { Badge } from "@/components/ui/badge"
// import { toast } from "@/components/ui/use-toast"
// import { Skeleton } from "@/components/ui/skeleton"

// /**
//  * Social Media Post Scheduler
//  *
//  * Note on timezones:
//  * All dates and times are stored in EST (Eastern Standard Time) in the database
//  * without timezone information. The UI displays and accepts times in EST.
//  * No timezone conversion is needed since everything is in EST by default.
//  */

// // Remove the timezone conversion functions and replace them with simpler versions that don't do timezone conversion

// // Replace the utcToEst24Hour function with this simpler version
// function formatTime(timeString: string) {
//   if (!timeString) return ""
//   // If it's a full timestamp, extract just the time portion
//   if (timeString.includes("T") || timeString.includes(" ")) {
//     const timePart = timeString.split(/[T ]/)[1]
//     return timePart ? timePart.substring(0, 5) : "" // Return HH:MM format
//   }
//   return timeString
// }

// // Replace the utcTimestampToEstDateTime function with this simpler version
// function parseDateTime(dateTimeString: string): { date: string; time: string } {
//   if (!dateTimeString) return { date: "", time: "" }
//   try {
//     // Handle both formats: '2023-05-15 14:30:00' and '2023-05-15T14:30:00'
//     const parts = dateTimeString.replace("T", " ").split(" ")
//     if (parts.length !== 2) return { date: "", time: "" }

//     const date = parts[0] // YYYY-MM-DD
//     const time = parts[1].substring(0, 5) // HH:MM

//     return { date, time }
//   } catch {
//     return { date: "", time: "" }
//   }
// }

// // Default time for new posts - consistent across both views
// const DEFAULT_POST_TIME = "09:00"

// // Generate days for the week based on a given date
// const generateWeekDays = (currentDate = new Date()) => {
//   const day = currentDate.getDay() // 0 is Sunday, 6 is Saturday
//   const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1) // Adjust to start from Monday
//   const startDate = new Date(currentDate)
//   startDate.setDate(diff)

//   return Array.from({ length: 7 }, (_, i) => {
//     const date = new Date(startDate)
//     date.setDate(startDate.getDate() + i)
//     return {
//       date,
//       dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
//       dayNumber: date.getDate(),
//       month: date.toLocaleDateString("en-US", { month: "short" }),
//       isToday: date.toDateString() === new Date().toDateString(),
//       slots: Array.from({ length: 4 }, (_, j) => ({
//         id: `slot-${i}-${j}-${Date.now()}`,
//         time: `${9 + j * 3}:00`, // 9:00, 12:00, 15:00, 18:00
//         post: null as Post | null,
//         posts: [] as Post[],
//       })),
//     }
//   })
// }

// // Generate days for the month based on a given date
// const generateMonthDays = (currentDate = new Date()) => {
//   const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
//   const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

//   let firstDayOfWeek = firstDay.getDay()
//   firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1 // Adjust for Monday start

//   const daysFromPrevMonth = firstDayOfWeek
//   const totalDays = daysFromPrevMonth + lastDay.getDate()
//   const rows = Math.ceil(totalDays / 7)
//   const days = []

//   const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate()
//   for (let i = 0; i < daysFromPrevMonth; i++) {
//     const date = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth() - 1,
//       prevMonthLastDay - daysFromPrevMonth + i + 1,
//     )
//     days.push({
//       date,
//       dayNumber: date.getDate(),
//       month: date.toLocaleDateString("en-US", { month: "short" }),
//       isCurrentMonth: false,
//       isToday: date.toDateString() === new Date().toDateString(),
//       slots: Array.from({ length: 2 }, (_, j) => ({
//         id: `month-prev-${date.getDate()}-${j}-${Date.now()}`,
//         time: j === 0 ? "09:00" : "15:00", // Changed to match common times with weekly view
//         post: null as Post | null,
//         posts: [] as Post[],
//       })),
//     })
//   }

//   for (let i = 1; i <= lastDay.getDate(); i++) {
//     const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
//     days.push({
//       date,
//       dayNumber: i,
//       month: date.toLocaleDateString("en-US", { month: "short" }),
//       isCurrentMonth: true,
//       isToday: date.toDateString() === new Date().toDateString(),
//       slots: Array.from({ length: 2 }, (_, j) => ({
//         id: `month-current-${i}-${j}-${Date.now()}`,
//         time: j === 0 ? "09:00" : "15:00", // Changed to match common times with weekly view
//         post: null as Post | null,
//         posts: [] as Post[],
//       })),
//     })
//   }

//   const remainingDays = rows * 7 - days.length
//   for (let i = 1; i <= remainingDays; i++) {
//     const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i)
//     days.push({
//       date,
//       dayNumber: i,
//       month: date.toLocaleDateString("en-US", { month: "short" }),
//       isCurrentMonth: false,
//       isToday: date.toDateString() === new Date().toDateString(),
//       slots: Array.from({ length: 2 }, (_, j) => ({
//         id: `month-next-${i}-${j}-${Date.now()}`,
//         time: j === 0 ? "09:00" : "15:00", // Changed to match common times with weekly view
//         post: null as Post | null,
//         posts: [] as Post[],
//       })),
//     })
//   }

//   return days
// }

// // Function to check if a date is in the past
// const isPastDate = (date: Date) => {
//   const today = new Date()
//   today.setHours(0, 0, 0, 0)
//   return date < today
// }

// // Fetch scheduled posts from Supabase (now from posts table)
// const fetchScheduledPosts = async (brandKitId: string): Promise<Post[]> => {
//   const supabase = createClient()
//   let query = supabase.from("posts").select("*")
//   if (typeof brandKitId === "string") {
//     query = query.eq("brand_kit_id", brandKitId as any)
//   }
//   query = query.not("scheduled_for", "is", null)
//   const { data, error } = await query
//   if (error || !Array.isArray(data)) {
//     console.error("Error fetching scheduled posts:", error)
//     return []
//   }
//   // Filter out any error objects
//   return (data as any[]).filter(isPost)
// }

// // Save scheduled post to Supabase (update post's scheduled_for and status)
// const saveScheduledPost = async (postId: string, date: string, time: string, brandKitId: string) => {
//   const supabase = createClient()
//   if (typeof postId !== "string" || typeof brandKitId !== "string") return
//   const safeTime = time && /^\d{2}:\d{2}$/.test(time) ? time : DEFAULT_POST_TIME
//   const safeDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date().toLocaleDateString("en-CA") // en-CA gives YYYY-MM-DD format
//   // Store directly in EST (no timezone conversion needed)
//   const scheduledFor = `${safeDate} ${safeTime}:00`

//   const updateObj = {
//     scheduled_for: scheduledFor,
//     status: "scheduled",
//   }

//   try {
//     const { error } = await supabase
//       .from("posts")
//       .update(updateObj as any)
//       .eq("id", postId as any)
//       .eq("brand_kit_id", brandKitId as any)

//     if (error) {
//       toast({
//         title: "Error scheduling post",
//         description: error.message,
//         variant: "destructive",
//       })
//       return false
//     }

//     toast({
//       title: "Post scheduled",
//       description: `Post scheduled for ${safeDate} at ${safeTime}`,
//     })
//     return true
//   } catch (error) {
//     console.error("Error saving scheduled post:", error)
//     toast({
//       title: "Error scheduling post",
//       description: "An unexpected error occurred",
//       variant: "destructive",
//     })
//     return false
//   }
// }

// // Remove scheduled post from Supabase (set scheduled_for to null and status to unscheduled)
// const removeScheduledPost = async (postId: string, brandKitId: string) => {
//   const supabase = createClient()
//   if (typeof postId !== "string" || typeof brandKitId !== "string") return
//   const updateObj = {
//     scheduled_for: null,
//     status: "unscheduled",
//   }

//   try {
//     const { error } = await supabase
//       .from("posts")
//       .update(updateObj as any)
//       .eq("id", postId as any)
//       .eq("brand_kit_id", brandKitId as any)

//     if (error) {
//       toast({
//         title: "Error removing scheduled post",
//         description: error.message,
//         variant: "destructive",
//       })
//       return false
//     }

//     toast({
//       title: "Post unscheduled",
//       description: "Post has been removed from the schedule",
//     })
//     return true
//   } catch (error) {
//     console.error("Error removing scheduled post:", error)
//     toast({
//       title: "Error removing post",
//       description: "An unexpected error occurred",
//     })
//     return false
//   }
// }

// // Type guards
// function isBrandKit(obj: any): obj is BrandKit {
//   return obj && typeof obj === "object" && typeof obj.id === "string" && typeof obj.name === "string"
// }

// function isPost(obj: any): obj is Post {
//   return (
//     obj &&
//     typeof obj === "object" &&
//     typeof obj.id === "string" &&
//     typeof obj.caption === "string" &&
//     typeof obj.image_url === "string"
//   )
// }

// export default function SchedulerPage() {
//   // Use localStorage to persist the selected brand kit
//   const [selectedBrandKitId, setSelectedBrandKitId] = useState<string>(() => {
//     // Try to get the stored brand kit ID from localStorage
//     if (typeof window !== "undefined") {
//       return localStorage.getItem("selectedBrandKitId") || ""
//     }
//     return ""
//   })
//   const [unscheduledPosts, setUnscheduledPosts] = useState<Post[]>([])
//   const [brandKits, setBrandKits] = useState<BrandKit[]>([])
//   const [weekDays, setWeekDays] = useState(generateWeekDays())
//   const [monthDays, setMonthDays] = useState(generateMonthDays())
//   const [isConnected, setIsConnected] = useState(false)
//   const [viewMode, setViewMode] = useState<"week" | "month">("week")
//   const [currentDate, setCurrentDate] = useState(new Date())
//   const [selectedDay, setSelectedDay] = useState<Date | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [loadingBrandKits, setLoadingBrandKits] = useState(true)
//   const [loadingPosts, setLoadingPosts] = useState(false)
//   const [isDragging, setIsDragging] = useState(false)

//   // Centralized fetch function
//   const fetchAndSync = async (brandKitId: string, date: Date) => {
//     if (!brandKitId) return
//     // Only set loadingPosts for initial load or brand kit change
//     if (!loadingBrandKits) setLoadingPosts(true)
//     try {
//       const postsRaw = await getPosts(brandKitId)
//       const posts = Array.isArray(postsRaw) ? postsRaw.filter(isPost) : []
//       const scheduledPostsRaw = await fetchScheduledPosts(brandKitId)
//       const scheduledPosts = Array.isArray(scheduledPostsRaw) ? scheduledPostsRaw.filter(isPost) : []
//       const scheduledPostIds = scheduledPosts.map((sp) => sp.id)
//       setUnscheduledPosts(posts.filter(isPost).filter((p) => !scheduledPostIds.includes(p.id)))

//       const newWeekDays = generateWeekDays(date)
//       const newMonthDays = generateMonthDays(date)

//       // Map scheduled posts into slots
//       scheduledPosts.forEach((post) => {
//         if (!isPost(post) || !post.scheduled_for) return
//         // Parse date and time (already in EST since we're storing without timezone)
//         const { date: estDateStr, time: estTime } = parseDateTime(post.scheduled_for)

//         // Week view
//         newWeekDays.forEach((day) => {
//           const dayDateStr = day.date.toISOString().split("T")[0]
//           if (dayDateStr === estDateStr) {
//             // Check if we already have a slot for this time
//             let slot = day.slots.find((s) => s.time === estTime)

//             if (!slot) {
//               // If no slot exists for this time, create a new one
//               slot = {
//                 id: `slot-${day.dayNumber}-${estTime}-${Date.now()}`,
//                 time: estTime,
//                 posts: [post],
//               }
//               day.slots.push(slot)
//             } else {
//               // If slot exists but doesn't have a posts array yet, create it
//               if (!slot.posts) {
//                 slot.posts = slot.post ? [slot.post] : []
//                 slot.post = null // Remove the single post reference
//               }

//               // Add the post to the posts array
//               slot.posts.push(post)
//             }
//           }
//         })

//         // Month view
//         newMonthDays.forEach((day) => {
//           const dayDateStr = day.date.toISOString().split("T")[0]
//           if (dayDateStr === estDateStr) {
//             // Check if we already have a slot for this time
//             let slot = day.slots.find((s) => s.time === estTime)

//             if (!slot) {
//               // If no slot exists for this time, create a new one
//               slot = {
//                 id: `month-slot-${day.dayNumber}-${estTime}-${Date.now()}`,
//                 time: estTime,
//                 posts: [post],
//               }
//               day.slots.push(slot)
//             } else {
//               // If slot exists but doesn't have a posts array yet, create it
//               if (!slot.posts) {
//                 slot.posts = slot.post ? [slot.post] : []
//                 slot.post = null // Remove the single post reference
//               }

//               // Add the post to the posts array
//               slot.posts.push(post)
//             }
//           }
//         })
//       })

//       setWeekDays(newWeekDays)
//       setMonthDays(newMonthDays)
//     } catch (error) {
//       console.error("Error fetching data:", error)
//       toast({
//         title: "Error loading data",
//         description: "Failed to load posts and schedule data",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingPosts(false)
//     }
//   }

//   // Load brand kits on mount
//   useEffect(() => {
//     async function loadBrandKits() {
//       setLoadingBrandKits(true)
//       try {
//         const kitsRaw = await getBrandKits()
//         const kits = Array.isArray(kitsRaw) ? kitsRaw.filter(isBrandKit) : []
//         setBrandKits(kits)

//         // If we have a stored brand kit ID, check if it exists in the loaded kits
//         if (selectedBrandKitId) {
//           const kitExists = kits.some((kit) => kit.id === selectedBrandKitId)
//           if (!kitExists && kits.length > 0) {
//             // If the stored kit doesn't exist anymore, use the first available kit
//             const firstKit = kits.find(isBrandKit)
//             if (firstKit && typeof firstKit.id === "string") {
//               setSelectedBrandKitId(firstKit.id)
//               localStorage.setItem("selectedBrandKitId", firstKit.id)
//             }
//           }
//         } else if (kits.length > 0) {
//           // If no kit is selected yet, use the first one
//           const firstKit = kits.find(isBrandKit)
//           if (firstKit && typeof firstKit.id === "string") {
//             setSelectedBrandKitId(firstKit.id)
//             localStorage.setItem("selectedBrandKitId", firstKit.id)
//           }
//         }
//       } catch (error) {
//         console.error("Error loading brand kits:", error)
//         toast({
//           title: "Error loading brand kits",
//           description: "Failed to load your brand kits",
//           variant: "destructive",
//         })
//       } finally {
//         setLoadingBrandKits(false)
//       }
//     }
//     loadBrandKits()
//   }, [])

//   // Fetch and sync whenever brand kit or current date changes
//   useEffect(() => {
//     if (!selectedBrandKitId) return
//     // Only show loading spinner for initial load or brand kit change, not for navigation
//     if (loadingBrandKits) return
//     fetchAndSync(selectedBrandKitId, currentDate)
//   }, [selectedBrandKitId, currentDate, loadingBrandKits])

//   // Navigation handlers
//   const goToToday = () => {
//     setCurrentDate(new Date())
//     // Do not set loadingPosts here
//   }

//   const navigatePrevious = () => {
//     const newDate = new Date(currentDate)
//     if (viewMode === "week") {
//       newDate.setDate(newDate.getDate() - 7)
//     } else {
//       newDate.setMonth(newDate.getMonth() - 1)
//     }
//     setCurrentDate(newDate)
//     // Do not set loadingPosts here
//   }

//   const navigateNext = () => {
//     const newDate = new Date(currentDate)
//     if (viewMode === "week") {
//       newDate.setDate(newDate.getDate() + 7)
//     } else {
//       newDate.setMonth(newDate.getMonth() + 1)
//     }
//     setCurrentDate(newDate)
//     // Do not set loadingPosts here
//   }

//   // Day selection handler
//   const handleDayClick = (date: Date) => {
//     setSelectedDay(date)
//   }

//   // Drag and drop handlers
//   const handleDragStart = () => {
//     setIsDragging(true)
//   }

//   const handleDragEnd = async (result: DropResult) => {
//     setIsDragging(false)
//     const { source, destination } = result

//     if (!destination) return

//     if (source.droppableId === "unscheduled-posts" && destination.droppableId !== "unscheduled-posts") {
//       const post = unscheduledPosts[source.index]
//       if (!post) return

//       // Optimistically update UI
//       const newUnscheduledPosts = [...unscheduledPosts]
//       newUnscheduledPosts.splice(source.index, 1)
//       setUnscheduledPosts(newUnscheduledPosts)

//       // For week view
//       if (viewMode === "week") {
//         const [_, dayIndexStr, slotIndexStr] = destination.droppableId.split("-")
//         const dayIndex = Number.parseInt(dayIndexStr, 10)
//         const slotIndex = Number.parseInt(slotIndexStr, 10)

//         if (isNaN(dayIndex) || isNaN(slotIndex)) return

//         const newWeekDays = [...weekDays]

//         // Initialize posts array if it doesn't exist
//         if (!newWeekDays[dayIndex].slots[slotIndex].posts) {
//           newWeekDays[dayIndex].slots[slotIndex].posts = []
//         }

//         // Add post to posts array
//         newWeekDays[dayIndex].slots[slotIndex].posts.push(post)
//         setWeekDays(newWeekDays)

//         const date = newWeekDays[dayIndex].date.toISOString().split("T")[0]
//         const time = newWeekDays[dayIndex].slots[slotIndex].time

//         // Save to database
//         const success = await saveScheduledPost(post.id, date, time, selectedBrandKitId)

//         // Revert UI if save failed
//         if (!success) {
//           newWeekDays[dayIndex].slots[slotIndex].posts = newWeekDays[dayIndex].slots[slotIndex].posts.filter(
//             (p) => p.id !== post.id,
//           )
//           setWeekDays(newWeekDays)
//           setUnscheduledPosts([...newUnscheduledPosts, post])
//         }
//       } else {
//         const [_, dayIndexStr, slotIndexStr] = destination.droppableId.split("-")
//         const dayIndex = Number.parseInt(dayIndexStr, 10)
//         const slotIndex = Number.parseInt(slotIndexStr, 10)

//         if (isNaN(dayIndex) || isNaN(slotIndex)) return

//         // For month view
//         const newMonthDays = [...monthDays]

//         // Initialize posts array if it doesn't exist
//         if (!newMonthDays[dayIndex].slots[slotIndex].posts) {
//           newMonthDays[dayIndex].slots[slotIndex].posts = []
//         }

//         // Add post to posts array
//         newMonthDays[dayIndex].slots[slotIndex].posts.push(post)
//         setMonthDays(newMonthDays)

//         const date = newMonthDays[dayIndex].date.toISOString().split("T")[0]
//         const time = newMonthDays[dayIndex].slots[slotIndex].time

//         // Save to database
//         const success = await saveScheduledPost(post.id, date, time, selectedBrandKitId)

//         // Revert UI if save failed
//         if (!success) {
//           newMonthDays[dayIndex].slots[slotIndex].posts = newMonthDays[dayIndex].slots[slotIndex].posts.filter(
//             (p) => p.id !== post.id,
//           )
//           setMonthDays(newMonthDays)
//           setUnscheduledPosts([...newUnscheduledPosts, post])
//         }
//       }
//     } else if (destination.droppableId === "unscheduled-posts") {
//       let post

//       if (viewMode === "week") {
//         const [_, dayIndexStr, slotIndexStr] = source.droppableId.split("-")
//         const dayIndex = Number.parseInt(dayIndexStr, 10)
//         const slotIndex = Number.parseInt(slotIndexStr, 10)

//         if (isNaN(dayIndex) || isNaN(slotIndex)) return

//         const newWeekDays = [...weekDays]
//         post = newWeekDays[dayIndex].slots[slotIndex].post

//         if (!post) return

//         // Optimistically update UI
//         newWeekDays[dayIndex].slots[slotIndex].post = null
//         setWeekDays(newWeekDays)

//         // Save to database
//         const success = await removeScheduledPost(post.id, selectedBrandKitId)

//         // Revert UI if save failed
//         if (!success) {
//           newWeekDays[dayIndex].slots[slotIndex].post = post
//           setWeekDays(newWeekDays)
//           return
//         }
//       } else {
//         const [_, dayIndexStr, slotIndexStr] = source.droppableId.split("-")
//         const dayIndex = Number.parseInt(dayIndexStr, 10)
//         const slotIndex = Number.parseInt(slotIndexStr, 10)

//         if (isNaN(dayIndex) || isNaN(slotIndex)) return

//         const newMonthDays = [...monthDays]
//         post = newMonthDays[dayIndex].slots[slotIndex].post

//         if (!post) return

//         // Optimistically update UI
//         newMonthDays[dayIndex].slots[slotIndex].post = null
//         setMonthDays(newMonthDays)

//         // Save to database
//         const success = await removeScheduledPost(post.id, selectedBrandKitId)

//         // Revert UI if save failed
//         if (!success) {
//           newMonthDays[dayIndex].slots[slotIndex].post = post
//           setMonthDays(newMonthDays)
//           return
//         }
//       }

//       if (post) setUnscheduledPosts([...unscheduledPosts, post])
//     } else {
//       let sourcePost

//       if (viewMode === "week") {
//         const [_, sDayIndexStr, sSlotIndexStr] = source.droppableId.split("-")
//         const [__, dDayIndexStr, dSlotIndexStr] = destination.droppableId.split("-")

//         const sDayIndex = Number.parseInt(sDayIndexStr, 10)
//         const sSlotIndex = Number.parseInt(sSlotIndexStr, 10)
//         const dDayIndex = Number.parseInt(dDayIndexStr, 10)
//         const dSlotIndex = Number.parseInt(dSlotIndexStr, 10)

//         if (isNaN(sDayIndex) || isNaN(sSlotIndex) || isNaN(dDayIndex) || isNaN(dSlotIndex)) return

//         const newWeekDays = [...weekDays]
//         sourcePost = newWeekDays[sDayIndex].slots[sSlotIndex].post

//         if (!sourcePost) return

//         // Optimistically update UI
//         newWeekDays[sDayIndex].slots[sSlotIndex].post = null
//         newWeekDays[dDayIndex].slots[dSlotIndex].post = sourcePost
//         setWeekDays(newWeekDays)

//         const date = newWeekDays[dDayIndex].date.toISOString().split("T")[0]
//         const time = newWeekDays[dDayIndex].slots[dSlotIndex].time

//         // Save to database
//         const success = await saveScheduledPost(sourcePost.id, date, time, selectedBrandKitId)

//         // Revert UI if save failed
//         if (!success) {
//           newWeekDays[sDayIndex].slots[sSlotIndex].post = sourcePost
//           newWeekDays[dDayIndex].slots[dSlotIndex].post = null
//           setWeekDays(newWeekDays)
//         }
//       } else {
//         const [_, sDayIndexStr, sSlotIndexStr] = source.droppableId.split("-")
//         const [__, dDayIndexStr, dSlotIndexStr] = destination.droppableId.split("-")

//         const sDayIndex = Number.parseInt(sDayIndexStr, 10)
//         const sSlotIndex = Number.parseInt(sSlotIndexStr, 10)
//         const dDayIndex = Number.parseInt(dDayIndexStr, 10)
//         const dSlotIndex = Number.parseInt(dSlotIndexStr, 10)

//         if (isNaN(sDayIndex) || isNaN(sSlotIndex) || isNaN(dDayIndex) || isNaN(dSlotIndex)) return

//         const newMonthDays = [...monthDays]
//         sourcePost = newMonthDays[sDayIndex].slots[sSlotIndex].post

//         if (!sourcePost) return

//         // Optimistically update UI
//         newMonthDays[sDayIndex].slots[sSlotIndex].post = null
//         newMonthDays[dDayIndex].slots[dSlotIndex].post = sourcePost
//         setMonthDays(newMonthDays)

//         const date = newMonthDays[dDayIndex].date.toISOString().split("T")[0]
//         const time = newMonthDays[dDayIndex].slots[dSlotIndex].time

//         // Save to database
//         const success = await saveScheduledPost(sourcePost.id, date, time, selectedBrandKitId)

//         // Revert UI if save failed
//         if (!success) {
//           newMonthDays[sDayIndex].slots[sSlotIndex].post = sourcePost
//           newMonthDays[dDayIndex].slots[dSlotIndex].post = null
//           setMonthDays(newMonthDays)
//         }
//       }
//     }
//   }

//   const addSlot = (dayIndex: number, view: "week" | "month") => {
//     if (view === "week") {
//       const newWeekDays = [...weekDays]
//       const newSlot = {
//         id: `slot-${dayIndex}-${newWeekDays[dayIndex].slots.length}-${Date.now()}`,
//         time: DEFAULT_POST_TIME, // Use the default time constant
//         post: null as Post | null,
//         posts: [] as Post[],
//       }
//       newWeekDays[dayIndex].slots.push(newSlot)
//       setWeekDays(newWeekDays)
//       toast({
//         title: "Slot added",
//         description: "New time slot added to schedule",
//       })
//     } else {
//       const newMonthDays = [...monthDays]
//       const newSlot = {
//         id: `month-${dayIndex}-${newMonthDays[dayIndex].slots.length}-${Date.now()}`,
//         time: DEFAULT_POST_TIME, // Use the default time constant
//         post: null as Post | null,
//         posts: [] as Post[],
//       }
//       newMonthDays[dayIndex].slots.push(newSlot)
//       setMonthDays(newMonthDays)
//       toast({
//         title: "Slot added",
//         description: "New time slot added to schedule",
//       })
//     }
//   }

//   // Replace the updateSlotTime function with this improved version that immediately updates the database
//   // and ensures both views stay in sync

//   const updateSlotTime = async (dayIndex: number, slotIndex: number, newTime: string, view: "week" | "month") => {
//     // Validate time format (HH:MM)
//     if (!/^\d{2}:\d{2}$/.test(newTime)) {
//       // If invalid format, don't update
//       return
//     }

//     if (view === "week") {
//       const newWeekDays = [...weekDays]
//       const oldTime = newWeekDays[dayIndex].slots[slotIndex].time
//       newWeekDays[dayIndex].slots[slotIndex].time = newTime
//       setWeekDays(newWeekDays)

//       const date = newWeekDays[dayIndex].date.toISOString().split("T")[0]
//       let postsToUpdate: Post[] = []

//       // Handle single post case
//       if (newWeekDays[dayIndex].slots[slotIndex].post) {
//         postsToUpdate.push(newWeekDays[dayIndex].slots[slotIndex].post!)
//       }

//       // Handle multiple posts case
//       if (newWeekDays[dayIndex].slots[slotIndex].posts && newWeekDays[dayIndex].slots[slotIndex].posts.length > 0) {
//         postsToUpdate = [...postsToUpdate, ...newWeekDays[dayIndex].slots[slotIndex].posts]
//       }

//       // Update each post in the database
//       for (const post of postsToUpdate) {
//         const success = await saveScheduledPost(post.id, date, newTime, selectedBrandKitId)

//         // If any update fails, revert the UI for this slot
//         if (!success) {
//           newWeekDays[dayIndex].slots[slotIndex].time = oldTime
//           setWeekDays(newWeekDays)
//           return
//         }
//       }

//       // If successful, update the month view to keep it in sync
//       const newMonthDays = [...monthDays]
//       const monthDayIndex = newMonthDays.findIndex((day) => day.date.toISOString().split("T")[0] === date)

//       if (monthDayIndex !== -1) {
//         // Find all slots with these posts
//         for (const post of postsToUpdate) {
//           const monthSlotIndex = newMonthDays[monthDayIndex].slots.findIndex(
//             (slot) => slot.post?.id === post.id || (slot.posts && slot.posts.some((p) => p.id === post.id)),
//           )

//           if (monthSlotIndex !== -1) {
//             newMonthDays[monthDayIndex].slots[monthSlotIndex].time = newTime
//           }
//         }
//         setMonthDays(newMonthDays)
//       }
//     } else {
//       // Month view time update
//       const newMonthDays = [...monthDays]
//       const oldTime = newMonthDays[dayIndex].slots[slotIndex].time
//       newMonthDays[dayIndex].slots[slotIndex].time = newTime
//       setMonthDays(newMonthDays)

//       const date = newMonthDays[dayIndex].date.toISOString().split("T")[0]
//       let postsToUpdate: Post[] = []

//       // Handle single post case
//       if (newMonthDays[dayIndex].slots[slotIndex].post) {
//         postsToUpdate.push(newMonthDays[dayIndex].slots[slotIndex].post!)
//       }

//       // Handle multiple posts case
//       if (newMonthDays[dayIndex].slots[slotIndex].posts && newMonthDays[dayIndex].slots[slotIndex].posts.length > 0) {
//         postsToUpdate = [...postsToUpdate, ...newMonthDays[dayIndex].slots[slotIndex].posts]
//       }

//       // Update each post in the database
//       for (const post of postsToUpdate) {
//         const success = await saveScheduledPost(post.id, date, newTime, selectedBrandKitId)

//         // If any update fails, revert the UI for this slot
//         if (!success) {
//           newMonthDays[dayIndex].slots[slotIndex].time = oldTime
//           setMonthDays(newMonthDays)
//           return
//         }
//       }

//       // If successful, update the week view to keep it in sync
//       const newWeekDays = [...weekDays]
//       const weekDayIndex = newWeekDays.findIndex((day) => day.date.toISOString().split("T")[0] === date)

//       if (weekDayIndex !== -1) {
//         // Find all slots with these posts
//         for (const post of postsToUpdate) {
//           const weekSlotIndex = newWeekDays[weekDayIndex].slots.findIndex(
//             (slot) => slot.post?.id === post.id || (slot.posts && slot.posts.some((p) => p.id === post.id)),
//           )

//           if (weekSlotIndex !== -1) {
//             newWeekDays[weekDayIndex].slots[weekSlotIndex].time = newTime
//           }
//         }
//         setWeekDays(newWeekDays)
//       }
//     }
//   }

//   const handleDeletePost = async (postId: string, dayIndex: number, slotIndex: number, view: "week" | "month") => {
//     let post: Post | null = null

//     if (view === "week") {
//       const newWeekDays = [...weekDays]

//       // Check if post is in the single post field
//       if (newWeekDays[dayIndex].slots[slotIndex].post?.id === postId) {
//         post = newWeekDays[dayIndex].slots[slotIndex].post
//         newWeekDays[dayIndex].slots[slotIndex].post = null
//       }
//       // Check if post is in the posts array
//       else if (newWeekDays[dayIndex].slots[slotIndex].posts) {
//         const postIndex = newWeekDays[dayIndex].slots[slotIndex].posts.findIndex((p) => p.id === postId)
//         if (postIndex !== -1) {
//           post = newWeekDays[dayIndex].slots[slotIndex].posts[postIndex]
//           newWeekDays[dayIndex].slots[slotIndex].posts.splice(postIndex, 1)
//         }
//       }

//       if (!post) return
//       setWeekDays(newWeekDays)
//     } else {
//       const newMonthDays = [...monthDays]

//       // Check if post is in the single post field
//       if (newMonthDays[dayIndex].slots[slotIndex].post?.id === postId) {
//         post = newMonthDays[dayIndex].slots[slotIndex].post
//         newMonthDays[dayIndex].slots[slotIndex].post = null
//       }
//       // Check if post is in the posts array
//       else if (newMonthDays[dayIndex].slots[slotIndex].posts) {
//         const postIndex = newMonthDays[dayIndex].slots[slotIndex].posts.findIndex((p) => p.id === postId)
//         if (postIndex !== -1) {
//           post = newMonthDays[dayIndex].slots[slotIndex].posts[postIndex]
//           newMonthDays[dayIndex].slots[slotIndex].posts.splice(postIndex, 1)
//         }
//       }

//       if (!post) return
//       setMonthDays(newMonthDays)
//     }

//     // Save to database
//     const success = await removeScheduledPost(post.id, selectedBrandKitId)

//     // Add back to unscheduled if successful
//     if (success) {
//       setUnscheduledPosts([...unscheduledPosts, post])
//     } else {
//       // Revert UI if failed
//       if (view === "week") {
//         const newWeekDays = [...weekDays]
//         if (!newWeekDays[dayIndex].slots[slotIndex].posts) {
//           newWeekDays[dayIndex].slots[slotIndex].posts = []
//         }
//         newWeekDays[dayIndex].slots[slotIndex].posts.push(post)
//         setWeekDays(newWeekDays)
//       } else {
//         const newMonthDays = [...monthDays]
//         if (!newMonthDays[dayIndex].slots[slotIndex].posts) {
//           newMonthDays[dayIndex].slots[slotIndex].posts = []
//         }
//         newMonthDays[dayIndex].slots[slotIndex].posts.push(post)
//         setMonthDays(newMonthDays)
//       }
//     }
//   }

//   const handleConnectInstagram = () => {
//     setIsConnected(!isConnected)
//     toast({
//       title: isConnected ? "Instagram disconnected" : "Instagram connected",
//       description: isConnected
//         ? "Your Instagram account has been disconnected"
//         : "Your Instagram account has been connected successfully",
//     })
//   }

//   const handleRefresh = () => {
//     if (!selectedBrandKitId) return
//     fetchAndSync(selectedBrandKitId, currentDate)
//     toast({
//       title: "Schedule refreshed",
//       description: "Your schedule has been updated with the latest data",
//     })
//   }

//   return (
//     <TooltipProvider>
//       <div className="flex h-screen flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
//         {/* Top Navigation Bar */}
//         <header className="border-b bg-white px-4 py-3 shadow-sm dark:bg-gray-950">
//           <div className="flex flex-wrap items-center justify-between gap-4">
//             <div className="flex items-center gap-2">
//               {loadingBrandKits ? (
//                 <Skeleton className="h-10 w-[180px]" />
//               ) : (
//                 <Select
//                   value={selectedBrandKitId}
//                   onValueChange={(value) => {
//                     setSelectedBrandKitId(value)
//                     localStorage.setItem("selectedBrandKitId", value)
//                   }}
//                 >
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Select Brand Kit" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {brandKits.length === 0 ? (
//                       <SelectItem value="no-kits" disabled>
//                         No brand kits available
//                       </SelectItem>
//                     ) : (
//                       brandKits.map((kit) => (
//                         <SelectItem key={kit.id} value={kit.id}>
//                           {kit.name}
//                         </SelectItem>
//                       ))
//                     )}
//                   </SelectContent>
//                 </Select>
//               )}
//               <Button variant="outline" size="sm" onClick={goToToday} className="font-medium">
//                 Today
//               </Button>
//               <div className="flex items-center gap-1">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8"
//                   onClick={navigatePrevious}
//                   aria-label="Previous"
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </Button>
//                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={navigateNext} aria-label="Next">
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </div>
//               <h2 className="text-lg font-semibold">
//                 {currentDate.toLocaleDateString("en-US", {
//                   month: "long",
//                   year: "numeric",
//                   ...(viewMode === "week" ? { day: "numeric" } : {}),
//                 })}
//               </h2>
//               <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loadingPosts} className="ml-2">
//                 {loadingPosts ? (
//                   <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                 ) : (
//                   <svg
//                     className="h-4 w-4 mr-2"
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
//                     <path d="M3 3v5h5" />
//                     <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
//                     <path d="M16 21h5v-5" />
//                   </svg>
//                 )}
//                 Refresh
//               </Button>
//             </div>
//             <div className="flex items-center gap-3">
//               <Select value={viewMode} onValueChange={(value) => setViewMode(value as "week" | "month")}>
//                 <SelectTrigger className="w-[140px]">
//                   <Calendar className="mr-2 h-4 w-4" />
//                   <SelectValue placeholder="View" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="week">Week View</SelectItem>
//                   <SelectItem value="month">Month View</SelectItem>
//                 </SelectContent>
//               </Select>
//               <Button
//                 onClick={handleConnectInstagram}
//                 variant={isConnected ? "outline" : "default"}
//                 className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
//               >
//                 <Instagram className="h-4 w-4" />
//                 {isConnected ? "Instagram Connected" : "Connect Instagram"}
//               </Button>
//             </div>
//           </div>
//         </header>

//         {/* Main Content Area */}
//         <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
//           <div className="flex flex-1 overflow-hidden">
//             {/* Sidebar */}
//             <aside className="flex w-72 flex-col border-r bg-white dark:bg-gray-900">
//               <div className="p-4 border-b">
//                 <h3 className="font-semibold">Unscheduled Posts</h3>
//                 <p className="text-sm text-muted-foreground">Drag posts to schedule them</p>
//               </div>
//               <Droppable droppableId="unscheduled-posts">
//                 {(provided, snapshot) => (
//                   <div
//                     {...provided.droppableProps}
//                     ref={provided.innerRef}
//                     className={`flex-1 overflow-y-auto p-4 ${snapshot.isDraggingOver ? "bg-primary/5" : ""}`}
//                   >
//                     {loadingPosts ? (
//                       <div className="space-y-3">
//                         {[1, 2, 3].map((i) => (
//                           <div key={i} className="rounded-lg border p-3">
//                             <div className="flex gap-3">
//                               <Skeleton className="h-14 w-14 rounded-md" />
//                               <div className="flex-1">
//                                 <Skeleton className="h-4 w-full mb-2" />
//                                 <Skeleton className="h-3 w-2/3" />
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : unscheduledPosts.length === 0 ? (
//                       <div className="flex flex-col items-center justify-center h-full text-center p-4">
//                         <svg
//                           className="h-12 w-12 text-muted-foreground mb-2"
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="24"
//                           height="24"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         >
//                           <rect width="18" height="18" x="3" y="3" rx="2" />
//                           <path d="M9 8h7" />
//                           <path d="M8 12h6" />
//                           <path d="M11 16h4" />
//                         </svg>
//                         <h4 className="font-medium mb-1">No unscheduled posts</h4>
//                         <p className="text-sm text-muted-foreground mb-4">
//                           Create new posts or unschedule existing ones to see them here
//                         </p>
//                         <Button size="sm" onClick={() => (window.location.href = "/dashboard")} className="gap-1">
//                           <Plus className="h-4 w-4" /> Create Post
//                         </Button>
//                       </div>
//                     ) : (
//                       <div className="space-y-3">
//                         {unscheduledPosts.map((post, index) => (
//                           <Draggable key={post.id} draggableId={post.id} index={index}>
//                             {(provided, snapshot) => (
//                               <div
//                                 ref={provided.innerRef}
//                                 {...provided.draggableProps}
//                                 {...provided.dragHandleProps}
//                                 className={`group cursor-grab rounded-lg border bg-card p-3 shadow-sm transition-all ${
//                                   snapshot.isDragging ? "rotate-1 scale-105 shadow-md" : ""
//                                 }`}
//                               >
//                                 <div className="flex gap-3">
//                                   <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md">
//                                     <Image
//                                       src={post.image_url || "/placeholder.svg"}
//                                       alt={`Post ${post.id}`}
//                                       fill
//                                       className="object-cover"
//                                     />
//                                   </div>
//                                   <div className="flex-1">
//                                     <p className="text-sm line-clamp-2">{post.caption}</p>
//                                     <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
//                                       <Badge variant="outline" className="text-[10px] px-1 py-0">
//                                         Unscheduled
//                                       </Badge>
//                                       <span className="ml-1">Drag to schedule</span>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
//                           </Draggable>
//                         ))}
//                         {provided.placeholder}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </Droppable>
//               <div className="border-t p-4">
//                 <Button className="w-full" size="sm" onClick={() => (window.location.href = "/dashboard")}>
//                   <Plus className="mr-2 h-4 w-4" /> Add Post
//                 </Button>
//               </div>
//             </aside>

//             {/* Calendar Area */}
//             <main className="flex-1 overflow-auto bg-white p-4 dark:bg-gray-950">
//               {viewMode === "week" ? (
//                 <div className="grid h-full grid-cols-7 gap-4">
//                   {weekDays.map((day, dayIndex) => (
//                     <div
//                       key={`day-${dayIndex}`}
//                       className={`flex flex-col rounded-lg border ${day.isToday ? "border-primary bg-primary/5" : ""}`}
//                     >
//                       <div
//                         className={`p-2 text-center ${day.isToday ? "font-bold text-primary" : ""}`}
//                         onClick={() => handleDayClick(day.date)}
//                       >
//                         <p className="text-sm font-medium">{day.dayName}</p>
//                         <p className="text-xl">{day.dayNumber}</p>
//                         <p className="text-xs text-muted-foreground">{day.month}</p>
//                       </div>
//                       <div className="flex flex-1 flex-col gap-3 p-2">
//                         {day.slots.map((slot, slotIndex) => (
//                           <Droppable
//                             key={slot.id}
//                             droppableId={`slot-${dayIndex}-${slotIndex}`}
//                             isDropDisabled={isPastDate(day.date)}
//                           >
//                             {(provided, snapshot) => (
//                               <div
//                                 ref={provided.innerRef}
//                                 {...provided.droppableProps}
//                                 className={`flex min-h-[100px] flex-col rounded-md border p-2 transition-colors ${
//                                   snapshot.isDraggingOver && !isPastDate(day.date)
//                                     ? "border-primary/50 bg-primary/5"
//                                     : isPastDate(day.date)
//                                       ? "bg-gray-50 dark:bg-gray-800/50"
//                                       : ""
//                                 } ${isPastDate(day.date) ? "opacity-70" : ""}`}
//                               >
//                                 <div className="mb-1 flex items-center gap-2">
//                                   <Clock className="h-3 w-3 text-muted-foreground" />
//                                   <Tooltip>
//                                     <TooltipTrigger asChild>
//                                       <span className="text-[10px] font-medium text-muted-foreground">EST</span>
//                                     </TooltipTrigger>
//                                     <TooltipContent>
//                                       <p className="text-xs">Eastern Standard Time</p>
//                                     </TooltipContent>
//                                   </Tooltip>
//                                   <Input
//                                     type="text"
//                                     value={slot.time}
//                                     onChange={(e) => {
//                                       const newWeekDays = [...weekDays]
//                                       newWeekDays[dayIndex].slots[slotIndex].time = e.target.value
//                                       setWeekDays(newWeekDays)
//                                     }}
//                                     onBlur={(e) => updateSlotTime(dayIndex, slotIndex, e.target.value, "week")}
//                                     className="h-6 w-16 text-xs"
//                                     disabled={isPastDate(day.date)}
//                                   />
//                                 </div>

//                                 {/* Display single post (legacy support) */}
//                                 {slot.post && (
//                                   <Draggable draggableId={`scheduled-${slot.post.id}`} index={0}>
//                                     {(provided, snapshot) => (
//                                       <div
//                                         ref={provided.innerRef}
//                                         {...provided.draggableProps}
//                                         {...provided.dragHandleProps}
//                                         className={`group flex flex-col gap-2 rounded-md bg-white p-2 shadow-sm transition-all dark:bg-gray-800 ${
//                                           snapshot.isDragging ? "rotate-1 scale-105 shadow-md" : ""
//                                         }`}
//                                       >
//                                         <div className="relative h-12 w-full overflow-hidden rounded-md">
//                                           {slot.post && (
//                                             <Image
//                                               src={slot.post.image_url || "/placeholder.svg"}
//                                               alt={`Post ${slot.post.id}`}
//                                               fill
//                                               className="object-cover"
//                                             />
//                                           )}
//                                           <div className="absolute right-1 top-1 flex opacity-0 transition-opacity group-hover:opacity-100">
//                                             <Tooltip>
//                                               <TooltipTrigger asChild>
//                                                 <Button
//                                                   variant="ghost"
//                                                   size="icon"
//                                                   className="h-6 w-6 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80"
//                                                   onClick={(e) => {
//                                                     e.stopPropagation()
//                                                     window.location.href = `/dashboard/edit/${slot.post?.id}`
//                                                   }}
//                                                 >
//                                                   <Edit2 className="h-3 w-3" />
//                                                 </Button>
//                                               </TooltipTrigger>
//                                               <TooltipContent>
//                                                 <p className="text-xs">Edit post</p>
//                                               </TooltipContent>
//                                             </Tooltip>
//                                             <Tooltip>
//                                               <TooltipTrigger asChild>
//                                                 <Button
//                                                   variant="ghost"
//                                                   size="icon"
//                                                   className="h-6 w-6 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80"
//                                                   onClick={(e) => {
//                                                     e.stopPropagation()
//                                                     if (slot.post) {
//                                                       handleDeletePost(slot.post.id, dayIndex, slotIndex, "week")
//                                                     }
//                                                   }}
//                                                 >
//                                                   <Trash2 className="h-3 w-3" />
//                                                 </Button>
//                                               </TooltipTrigger>
//                                               <TooltipContent>
//                                                 <p className="text-xs">Unschedule post</p>
//                                               </TooltipContent>
//                                             </Tooltip>
//                                           </div>
//                                         </div>
//                                         {slot.post && <p className="text-xs line-clamp-2">{slot.post.caption}</p>}
//                                       </div>
//                                     )}
//                                   </Draggable>
//                                 )}

//                                 {/* Display multiple posts */}
//                                 {slot.posts && slot.posts.length > 0 && (
//                                   <div className="flex flex-col gap-2">
//                                     {slot.posts.map((post, postIndex) => (
//                                       <Draggable
//                                         key={`multi-${post.id}`}
//                                         draggableId={`scheduled-multi-${post.id}-${postIndex}`}
//                                         index={postIndex}
//                                       >
//                                         {(provided, snapshot) => (
//                                           <div
//                                             ref={provided.innerRef}
//                                             {...provided.draggableProps}
//                                             {...provided.dragHandleProps}
//                                             className={`group flex flex-col gap-2 rounded-md bg-white p-2 shadow-sm transition-all dark:bg-gray-800 ${
//                                               snapshot.isDragging ? "rotate-1 scale-105 shadow-md" : ""
//                                             }`}
//                                           >
//                                             <div className="relative h-12 w-full overflow-hidden rounded-md">
//                                               <Image
//                                                 src={post.image_url || "/placeholder.svg"}
//                                                 alt={`Post ${post.id}`}
//                                                 fill
//                                                 className="object-cover"
//                                               />
//                                               <div className="absolute right-1 top-1 flex opacity-0 transition-opacity group-hover:opacity-100">
//                                                 <Tooltip>
//                                                   <TooltipTrigger asChild>
//                                                     <Button
//                                                       variant="ghost"
//                                                       size="icon"
//                                                       className="h-6 w-6 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80"
//                                                       onClick={(e) => {
//                                                         e.stopPropagation()
//                                                         window.location.href = `/dashboard/edit/${post.id}`
//                                                       }}
//                                                     >
//                                                       <Edit2 className="h-3 w-3" />
//                                                     </Button>
//                                                   </TooltipTrigger>
//                                                   <TooltipContent>
//                                                     <p className="text-xs">Edit post</p>
//                                                   </TooltipContent>
//                                                 </Tooltip>
//                                                 <Tooltip>
//                                                   <TooltipTrigger asChild>
//                                                     <Button
//                                                       variant="ghost"
//                                                       size="icon"
//                                                       className="h-6 w-6 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80"
//                                                       onClick={(e) => {
//                                                         e.stopPropagation()
//                                                         handleDeletePost(post.id, dayIndex, slotIndex, "week")
//                                                       }}
//                                                     >
//                                                       <Trash2 className="h-3 w-3" />
//                                                     </Button>
//                                                   </TooltipTrigger>
//                                                   <TooltipContent>
//                                                     <p className="text-xs">Unschedule post</p>
//                                                   </TooltipContent>
//                                                 </Tooltip>
//                                               </div>
//                                             </div>
//                                             <p className="text-xs line-clamp-2">{post.caption}</p>
//                                           </div>
//                                         )}
//                                       </Draggable>
//                                     ))}
//                                   </div>
//                                 )}

//                                 {provided.placeholder}
//                               </div>
//                             )}
//                           </Droppable>
//                         ))}
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => addSlot(dayIndex, "week")}
//                           className="text-xs h-8"
//                           disabled={isPastDate(day.date)}
//                         >
//                           <Plus className="h-3 w-3 mr-1" /> Add Slot
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-7 gap-1">
//                   {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
//                     <div key={day} className="p-2 text-center text-sm font-medium">
//                       {day}
//                     </div>
//                   ))}
//                   {monthDays.map((day, index) => (
//                     <div
//                       key={`month-day-${index}`}
//                       className={`min-h-[120px] border p-1 ${
//                         day.isToday
//                           ? "border-primary bg-primary/5"
//                           : day.isCurrentMonth
//                             ? ""
//                             : "bg-gray-50 opacity-50 dark:bg-gray-900"
//                       }`}
//                       onClick={() => handleDayClick(day.date)}
//                     >
//                       <div className={`mb-1 text-right text-sm ${day.isToday ? "font-bold text-primary" : ""}`}>
//                         {day.dayNumber}
//                       </div>
//                       <div className="flex flex-col gap-1">
//                         {day.slots.map((slot, slotIndex) => (
//                           <Droppable
//                             key={slot.id}
//                             droppableId={`month-${index}-${slotIndex}`}
//                             isDropDisabled={isPastDate(day.date) || !!slot.post}
//                           >
//                             {(provided, snapshot) => (
//                               <div
//                                 ref={provided.innerRef}
//                                 {...provided.droppableProps}
//                                 className={`min-h-[40px] ${
//                                   snapshot.isDraggingOver && !isPastDate(day.date) && !slot.post
//                                     ? "border-primary/50 bg-primary/5 rounded border"
//                                     : ""
//                                 } ${isPastDate(day.date) ? "opacity-70" : ""}`}
//                               >
//                                 {/* Single post (legacy support) */}
//                                 {slot.post && (
//                                   <Draggable
//                                     draggableId={`month-scheduled-${slot.post.id}-${index}-${slotIndex}`}
//                                     index={0}
//                                   >
//                                     {(provided, snapshot) => (
//                                       <div
//                                         ref={provided.innerRef}
//                                         {...provided.draggableProps}
//                                         {...provided.dragHandleProps}
//                                         className={`group flex items-center gap-1 rounded bg-white p-1 text-xs shadow-sm dark:bg-gray-800 ${
//                                           snapshot.isDragging ? "rotate-1 scale-105" : ""
//                                         }`}
//                                       >
//                                         <div className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded">
//                                           {slot.post && (
//                                             <Image
//                                               src={slot.post.image_url || "/placeholder.svg"}
//                                               alt={`Post ${slot.post.id}`}
//                                               fill
//                                               className="object-cover"
//                                             />
//                                           )}
//                                         </div>
//                                         <Input
//                                           type="text"
//                                           value={slot.time}
//                                           onChange={(e) => {
//                                             const newMonthDays = [...monthDays]
//                                             newMonthDays[index].slots[slotIndex].time = e.target.value
//                                             setMonthDays(newMonthDays)
//                                           }}
//                                           onBlur={(e) => updateSlotTime(index, slotIndex, e.target.value, "month")}
//                                           className="h-6 w-16 text-xs"
//                                           disabled={isPastDate(day.date)}
//                                         />
//                                         <span className="text-[10px] text-muted-foreground hidden sm:inline">EST</span>
//                                         <div className="ml-auto flex opacity-0 transition-opacity group-hover:opacity-100">
//                                           <Tooltip>
//                                             <TooltipTrigger asChild>
//                                               <Button
//                                                 variant="ghost"
//                                                 size="icon"
//                                                 className="h-5 w-5"
//                                                 onClick={(e) => {
//                                                   e.stopPropagation()
//                                                   window.location.href = `/dashboard/edit/${slot.post?.id}`
//                                                 }}
//                                               >
//                                                 <Edit2 className="h-2.5 w-2.5" />
//                                               </Button>
//                                             </TooltipTrigger>
//                                             <TooltipContent>
//                                               <p className="text-xs">Edit post</p>
//                                             </TooltipContent>
//                                           </Tooltip>
//                                           <Tooltip>
//                                             <TooltipTrigger asChild>
//                                               <Button
//                                                 variant="ghost"
//                                                 size="icon"
//                                                 className="h-5 w-5"
//                                                 onClick={(e) => {
//                                                   e.stopPropagation()
//                                                   if (slot.post) {
//                                                     handleDeletePost(slot.post.id, index, slotIndex, "month")
//                                                   }
//                                                 }}
//                                               >
//                                                 <Trash2 className="h-2.5 w-2.5" />
//                                               </Button>
//                                             </TooltipTrigger>
//                                             <TooltipContent>
//                                               <p className="text-xs">Unschedule post</p>
//                                             </TooltipContent>
//                                           </Tooltip>
//                                         </div>
//                                       </div>
//                                     )}
//                                   </Draggable>
//                                 )}

//                                 {/* Multiple posts */}
//                                 {slot.posts && slot.posts.length > 0 && (
//                                   <div className="flex flex-col gap-1 mt-1">
//                                     {slot.posts.map((post, postIndex) => (
//                                       <Draggable
//                                         key={`month-multi-${post.id}-${postIndex}`}
//                                         draggableId={`month-scheduled-multi-${post.id}-${index}-${slotIndex}-${postIndex}`}
//                                         index={postIndex}
//                                       >
//                                         {(provided, snapshot) => (
//                                           <div
//                                             ref={provided.innerRef}
//                                             {...provided.draggableProps}
//                                             {...provided.dragHandleProps}
//                                             className={`group flex items-center gap-1 rounded bg-white p-1 text-xs shadow-sm dark:bg-gray-800 ${
//                                               snapshot.isDragging ? "rotate-1 scale-105" : ""
//                                             }`}
//                                           >
//                                             <div className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded">
//                                               <Image
//                                                 src={post.image_url || "/placeholder.svg"}
//                                                 alt={`Post ${post.id}`}
//                                                 fill
//                                                 className="object-cover"
//                                               />
//                                             </div>
//                                             {postIndex === 0 && (
//                                               <>
//                                                 <Input
//                                                   type="text"
//                                                   value={slot.time}
//                                                   onChange={(e) => {
//                                                     const newMonthDays = [...monthDays]
//                                                     newMonthDays[index].slots[slotIndex].time = e.target.value
//                                                     setMonthDays(newMonthDays)
//                                                   }}
//                                                   onBlur={(e) =>
//                                                     updateSlotTime(index, slotIndex, e.target.value, "month")
//                                                   }
//                                                   className="h-6 w-16 text-xs"
//                                                   disabled={isPastDate(day.date)}
//                                                 />
//                                                 <span className="text-[10px] text-muted-foreground hidden sm:inline">
//                                                   EST
//                                                 </span>
//                                               </>
//                                             )}
//                                             {postIndex !== 0 && (
//                                               <span className="ml-16 text-[10px] text-muted-foreground">
//                                                 +{postIndex}
//                                               </span>
//                                             )}
//                                             <div className="ml-auto flex opacity-0 transition-opacity group-hover:opacity-100">
//                                               <Tooltip>
//                                                 <TooltipTrigger asChild>
//                                                   <Button
//                                                     variant="ghost"
//                                                     size="icon"
//                                                     className="h-5 w-5"
//                                                     onClick={(e) => {
//                                                       e.stopPropagation()
//                                                       window.location.href = `/dashboard/edit/${post.id}`
//                                                     }}
//                                                   >
//                                                     <Edit2 className="h-2.5 w-2.5" />
//                                                   </Button>
//                                                 </TooltipTrigger>
//                                                 <TooltipContent>
//                                                   <p className="text-xs">Edit post</p>
//                                                 </TooltipContent>
//                                               </Tooltip>
//                                               <Tooltip>
//                                                 <TooltipTrigger asChild>
//                                                   <Button
//                                                     variant="ghost"
//                                                     size="icon"
//                                                     className="h-5 w-5"
//                                                     onClick={(e) => {
//                                                       e.stopPropagation()
//                                                       handleDeletePost(post.id, index, slotIndex, "month")
//                                                     }}
//                                                   >
//                                                     <Trash2 className="h-2.5 w-2.5" />
//                                                   </Button>
//                                                 </TooltipTrigger>
//                                                 <TooltipContent>
//                                                   <p className="text-xs">Unschedule post</p>
//                                                 </TooltipContent>
//                                               </Tooltip>
//                                             </div>
//                                           </div>
//                                         )}
//                                       </Draggable>
//                                     ))}
//                                   </div>
//                                 )}

//                                 {provided.placeholder}
//                               </div>
//                             )}
//                           </Droppable>
//                         ))}
//                         {day.isCurrentMonth && (
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={(e) => {
//                               e.stopPropagation()
//                               addSlot(index, "month")
//                             }}
//                             className="text-xs h-6 mt-1"
//                             disabled={isPastDate(day.date)}
//                           >
//                             <Plus className="h-3 w-3" />
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </main>
//           </div>
//         </DragDropContext>
//       </div>
//     </TooltipProvider>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Calendar, Plus, Instagram, Edit2, Trash2, Clock, Loader2 } from "lucide-react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { createClient } from "@/lib/supabase/client"
import type { Post, BrandKit } from "@/lib/supabase/database.types"
import { getBrandKits } from "@/lib/actions/brand-kits"
import { getPosts } from "@/lib/actions/posts"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Social Media Post Scheduler
 *
 * Note on timezones:
 * All dates and times are stored in EST (Eastern Standard Time) in the database
 * without timezone information. The UI displays and accepts times in EST.
 * No timezone conversion is needed since everything is in EST by default.
 */

// Remove the timezone conversion functions and replace them with simpler versions that don't do timezone conversion

// Replace the utcToEst24Hour function with this simpler version
function formatTime(timeString: string) {
  if (!timeString) return ""
  // If it's a full timestamp, extract just the time portion
  if (timeString.includes("T") || timeString.includes(" ")) {
    const timePart = timeString.split(/[T ]/)[1]
    return timePart ? timePart.substring(0, 5) : "" // Return HH:MM format
  }
  return timeString
}

// Replace the utcTimestampToEstDateTime function with this simpler version
function parseDateTime(dateTimeString: string): { date: string; time: string } {
  if (!dateTimeString) return { date: "", time: "" }
  try {
    // Handle both formats: '2023-05-15 14:30:00' and '2023-05-15T14:30:00'
    const parts = dateTimeString.replace("T", " ").split(" ")
    if (parts.length !== 2) return { date: "", time: "" }

    const date = parts[0] // YYYY-MM-DD
    const time = parts[1].substring(0, 5) // HH:MM

    return { date, time }
  } catch {
    return { date: "", time: "" }
  }
}

// Default time for new posts - consistent across both views
const DEFAULT_POST_TIME = "09:00"

// Generate days for the week based on a given date
const generateWeekDays = (currentDate = new Date()) => {
  const day = currentDate.getDay() // 0 is Sunday, 6 is Saturday
  const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1) // Adjust to start from Monday
  const startDate = new Date(currentDate)
  startDate.setDate(diff)

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    return {
      date,
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      isToday: date.toDateString() === new Date().toDateString(),
      slots: Array.from({ length: 4 }, (_, j) => ({
        id: `slot-${i}-${j}-${Date.now()}`,
        time: `${9 + j * 3}:00`, // 9:00, 12:00, 15:00, 18:00
        post: null as Post | null,
        posts: [] as Post[],
      })),
    }
  })
}

// Generate days for the month based on a given date
const generateMonthDays = (currentDate = new Date()) => {
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

  let firstDayOfWeek = firstDay.getDay()
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1 // Adjust for Monday start

  const daysFromPrevMonth = firstDayOfWeek
  const totalDays = daysFromPrevMonth + lastDay.getDate()
  const rows = Math.ceil(totalDays / 7)
  const days = []

  const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate()
  for (let i = 0; i < daysFromPrevMonth; i++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      prevMonthLastDay - daysFromPrevMonth + i + 1,
    )
    days.push({
      date,
      dayNumber: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      isCurrentMonth: false,
      isToday: date.toDateString() === new Date().toDateString(),
      slots: Array.from({ length: 2 }, (_, j) => ({
        id: `month-prev-${date.getDate()}-${j}-${Date.now()}`,
        time: j === 0 ? "09:00" : "15:00", // Changed to match common times with weekly view
        post: null as Post | null,
        posts: [] as Post[],
      })),
    })
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
    days.push({
      date,
      dayNumber: i,
      month: date.toLocaleDateString("en-US", { month: "short" }),
      isCurrentMonth: true,
      isToday: date.toDateString() === new Date().toDateString(),
      slots: Array.from({ length: 2 }, (_, j) => ({
        id: `month-current-${i}-${j}-${Date.now()}`,
        time: j === 0 ? "09:00" : "15:00", // Changed to match common times with weekly view
        post: null as Post | null,
        posts: [] as Post[],
      })),
    })
  }

  const remainingDays = rows * 7 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i)
    days.push({
      date,
      dayNumber: i,
      month: date.toLocaleDateString("en-US", { month: "short" }),
      isCurrentMonth: false,
      isToday: date.toDateString() === new Date().toDateString(),
      slots: Array.from({ length: 2 }, (_, j) => ({
        id: `month-next-${i}-${j}-${Date.now()}`,
        time: j === 0 ? "09:00" : "15:00", // Changed to match common times with weekly view
        post: null as Post | null,
        posts: [] as Post[],
      })),
    })
  }

  return days
}

// Function to check if a date is in the past
const isPastDate = (date: Date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

// Fetch scheduled posts from Supabase (now from posts table)
const fetchScheduledPosts = async (brandKitId: string): Promise<Post[]> => {
  const supabase = createClient()
  let query = supabase.from("posts").select("*")
  if (typeof brandKitId === "string") {
    query = query.eq("brand_kit_id", brandKitId as any)
  }
  query = query.not("scheduled_for", "is", null)
  const { data, error } = await query
  if (error || !Array.isArray(data)) {
    console.error("Error fetching scheduled posts:", error)
    return []
  }
  // Filter out any error objects
  return (data as any[]).filter(isPost)
}

// Save scheduled post to Supabase (update post's scheduled_for and status)
const saveScheduledPost = async (postId: string, date: string, time: string, brandKitId: string) => {
  const supabase = createClient()
  if (typeof postId !== "string" || typeof brandKitId !== "string") return
  const safeTime = time && /^\d{2}:\d{2}$/.test(time) ? time : DEFAULT_POST_TIME
  const safeDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date().toLocaleDateString("en-CA") // en-CA gives YYYY-MM-DD format
  // Store directly in EST (no timezone conversion needed)
  const scheduledFor = `${safeDate} ${safeTime}:00`

  const updateObj = {
    scheduled_for: scheduledFor,
    status: "scheduled",
  }

  try {
    const { error } = await supabase
      .from("posts")
      .update(updateObj as any)
      .eq("id", postId as any)
      .eq("brand_kit_id", brandKitId as any)

    if (error) {
      toast({
        title: "Error scheduling post",
        description: error.message,
        variant: "destructive",
      })
      return false
    }

    toast({
      title: "Post scheduled",
      description: `Post scheduled for ${safeDate} at ${safeTime}`,
    })
    return true
  } catch (error) {
    console.error("Error saving scheduled post:", error)
    toast({
      title: "Error scheduling post",
      description: "An unexpected error occurred",
      variant: "destructive",
    })
    return false
  }
}

// Remove scheduled post from Supabase (set scheduled_for to null and status to unscheduled)
const removeScheduledPost = async (postId: string, brandKitId: string) => {
  const supabase = createClient()
  if (typeof postId !== "string" || typeof brandKitId !== "string") return
  const updateObj = {
    scheduled_for: null,
    status: "unscheduled",
  }

  try {
    const { error } = await supabase
      .from("posts")
      .update(updateObj as any)
      .eq("id", postId as any)
      .eq("brand_kit_id", brandKitId as any)

    if (error) {
      toast({
        title: "Error removing scheduled post",
        description: error.message,
        variant: "destructive",
      })
      return false
    }

    toast({
      title: "Post unscheduled",
      description: "Post has been removed from the schedule",
    })
    return true
  } catch (error) {
    console.error("Error removing scheduled post:", error)
    toast({
      title: "Error removing post",
      description: "An unexpected error occurred",
    })
    return false
  }
}

// Type guards
function isBrandKit(obj: any): obj is BrandKit {
  return obj && typeof obj === "object" && typeof obj.id === "string" && typeof obj.name === "string"
}

function isPost(obj: any): obj is Post {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.caption === "string" &&
    typeof obj.image_url === "string"
  )
}

export default function SchedulerPage() {
  // Use localStorage to persist the selected brand kit
  const [selectedBrandKitId, setSelectedBrandKitId] = useState<string>(() => {
    // Try to get the stored brand kit ID from localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedBrandKitId") || ""
    }
    return ""
  })
  const [unscheduledPosts, setUnscheduledPosts] = useState<Post[]>([])
  const [brandKits, setBrandKits] = useState<BrandKit[]>([])
  const [weekDays, setWeekDays] = useState(generateWeekDays())
  const [monthDays, setMonthDays] = useState(generateMonthDays())
  const [isConnected, setIsConnected] = useState(false)
  const [viewMode, setViewMode] = useState<"week" | "month">("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingBrandKits, setLoadingBrandKits] = useState(true)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Centralized fetch function
  const fetchAndSync = async (brandKitId: string, date: Date) => {
    if (!brandKitId) return
    // Only set loadingPosts for initial load or brand kit change
    if (!loadingBrandKits) setLoadingPosts(true)
    try {
      const postsRaw = await getPosts(brandKitId)
      const posts = Array.isArray(postsRaw) ? postsRaw.filter(isPost) : []
      const scheduledPostsRaw = await fetchScheduledPosts(brandKitId)
      const scheduledPosts = Array.isArray(scheduledPostsRaw) ? scheduledPostsRaw.filter(isPost) : []
      const scheduledPostIds = scheduledPosts.map((sp) => sp.id)
      setUnscheduledPosts(posts.filter(isPost).filter((p) => !scheduledPostIds.includes(p.id)))

      const newWeekDays = generateWeekDays(date)
      const newMonthDays = generateMonthDays(date)

      // Map scheduled posts into slots
      scheduledPosts.forEach((post) => {
        if (!isPost(post) || !post.scheduled_for) return
        // Parse date and time (already in EST since we're storing without timezone)
        const { date: estDateStr, time: estTime } = parseDateTime(post.scheduled_for)

        // Week view
        newWeekDays.forEach((day) => {
          const dayDateStr = day.date.toISOString().split("T")[0]
          if (dayDateStr === estDateStr) {
            // Check if we already have a slot for this time
            let slot = day.slots.find((s) => s.time === estTime)

            if (!slot) {
              // If no slot exists for this time, create a new one
              slot = {
                id: `slot-${day.dayNumber}-${estTime}-${Date.now()}`,
                time: estTime,
                posts: [post],
              }
              day.slots.push(slot)
            } else {
              // If slot exists but doesn't have a posts array yet, create it
              if (!slot.posts) {
                slot.posts = slot.post ? [slot.post] : []
                slot.post = null // Remove the single post reference
              }

              // Add the post to the posts array
              slot.posts.push(post)
            }
          }
        })

        // Month view
        newMonthDays.forEach((day) => {
          const dayDateStr = day.date.toISOString().split("T")[0]
          if (dayDateStr === estDateStr) {
            // Check if we already have a slot for this time
            let slot = day.slots.find((s) => s.time === estTime)

            if (!slot) {
              // If no slot exists for this time, create a new one
              slot = {
                id: `month-slot-${day.dayNumber}-${estTime}-${Date.now()}`,
                time: estTime,
                posts: [post],
              }
              day.slots.push(slot)
            } else {
              // If slot exists but doesn't have a posts array yet, create it
              if (!slot.posts) {
                slot.posts = slot.post ? [slot.post] : []
                slot.post = null // Remove the single post reference
              }

              // Add the post to the posts array
              slot.posts.push(post)
            }
          }
        })
      })

      setWeekDays(newWeekDays)
      setMonthDays(newMonthDays)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error loading data",
        description: "Failed to load posts and schedule data",
        variant: "destructive",
      })
    } finally {
      setLoadingPosts(false)
    }
  }

  // Load brand kits on mount
  useEffect(() => {
    async function loadBrandKits() {
      setLoadingBrandKits(true)
      try {
        const kitsRaw = await getBrandKits()
        const kits = Array.isArray(kitsRaw) ? kitsRaw.filter(isBrandKit) : []
        setBrandKits(kits)

        // If we have a stored brand kit ID, check if it exists in the loaded kits
        if (selectedBrandKitId) {
          const kitExists = kits.some((kit) => kit.id === selectedBrandKitId)
          if (!kitExists && kits.length > 0) {
            // If the stored kit doesn't exist anymore, use the first available kit
            const firstKit = kits.find(isBrandKit)
            if (firstKit && typeof firstKit.id === "string") {
              setSelectedBrandKitId(firstKit.id)
              localStorage.setItem("selectedBrandKitId", firstKit.id)
            }
          }
        } else if (kits.length > 0) {
          // If no kit is selected yet, use the first one
          const firstKit = kits.find(isBrandKit)
          if (firstKit && typeof firstKit.id === "string") {
            setSelectedBrandKitId(firstKit.id)
            localStorage.setItem("selectedBrandKitId", firstKit.id)
          }
        }
      } catch (error) {
        console.error("Error loading brand kits:", error)
        toast({
          title: "Error loading brand kits",
          description: "Failed to load your brand kits",
          variant: "destructive",
        })
      } finally {
        setLoadingBrandKits(false)
      }
    }
    loadBrandKits()
  }, [])

  // Fetch and sync whenever brand kit or current date changes
  useEffect(() => {
    if (!selectedBrandKitId) return
    // Only show loading spinner for initial load or brand kit change, not for navigation
    if (loadingBrandKits) return
    fetchAndSync(selectedBrandKitId, currentDate)
  }, [selectedBrandKitId, currentDate, loadingBrandKits])

  // Navigation handlers
  const goToToday = () => {
    setCurrentDate(new Date())
    // Do not set loadingPosts here
  }

  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
    // Do not set loadingPosts here
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
    // Do not set loadingPosts here
  }

  // Day selection handler
  const handleDayClick = (date: Date) => {
    setSelectedDay(date)
  }

  // Drag and drop handlers
  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = async (result: DropResult) => {
    setIsDragging(false)
    const { source, destination } = result

    if (!destination) return

    if (source.droppableId === "unscheduled-posts" && destination.droppableId !== "unscheduled-posts") {
      const post = unscheduledPosts[source.index]
      if (!post) return

      // Optimistically update UI
      const newUnscheduledPosts = [...unscheduledPosts]
      newUnscheduledPosts.splice(source.index, 1)
      setUnscheduledPosts(newUnscheduledPosts)

      // For week view
      if (viewMode === "week") {
        const [_, dayIndexStr, slotIndexStr] = destination.droppableId.split("-")
        const dayIndex = Number.parseInt(dayIndexStr, 10)
        const slotIndex = Number.parseInt(slotIndexStr, 10)

        if (isNaN(dayIndex) || isNaN(slotIndex)) return

        const newWeekDays = [...weekDays]

        // Initialize posts array if it doesn't exist
        if (!newWeekDays[dayIndex].slots[slotIndex].posts) {
          newWeekDays[dayIndex].slots[slotIndex].posts = []
        }

        // Add post to posts array
        newWeekDays[dayIndex].slots[slotIndex].posts.push(post)
        setWeekDays(newWeekDays)

        const date = newWeekDays[dayIndex].date.toISOString().split("T")[0]
        const time = newWeekDays[dayIndex].slots[slotIndex].time

        // Save to database
        const success = await saveScheduledPost(post.id, date, time, selectedBrandKitId)

        // Revert UI if save failed
        if (!success) {
          newWeekDays[dayIndex].slots[slotIndex].posts = newWeekDays[dayIndex].slots[slotIndex].posts.filter(
            (p) => p.id !== post.id,
          )
          setWeekDays(newWeekDays)
          setUnscheduledPosts([...newUnscheduledPosts, post])
        }
      } else {
        const [_, dayIndexStr, slotIndexStr] = destination.droppableId.split("-")
        const dayIndex = Number.parseInt(dayIndexStr, 10)
        const slotIndex = Number.parseInt(slotIndexStr, 10)

        if (isNaN(dayIndex) || isNaN(slotIndex)) return

        // For month view
        const newMonthDays = [...monthDays]

        // Initialize posts array if it doesn't exist
        if (!newMonthDays[dayIndex].slots[slotIndex].posts) {
          newMonthDays[dayIndex].slots[slotIndex].posts = []
        }

        // Add post to posts array
        newMonthDays[dayIndex].slots[slotIndex].posts.push(post)
        setMonthDays(newMonthDays)

        const date = newMonthDays[dayIndex].date.toISOString().split("T")[0]
        const time = newMonthDays[dayIndex].slots[slotIndex].time

        // Save to database
        const success = await saveScheduledPost(post.id, date, time, selectedBrandKitId)

        // Revert UI if save failed
        if (!success) {
          newMonthDays[dayIndex].slots[slotIndex].posts = newMonthDays[dayIndex].slots[slotIndex].posts.filter(
            (p) => p.id !== post.id,
          )
          setMonthDays(newMonthDays)
          setUnscheduledPosts([...newUnscheduledPosts, post])
        }
      }
    } else if (destination.droppableId === "unscheduled-posts") {
      let post

      if (viewMode === "week") {
        const [_, dayIndexStr, slotIndexStr] = source.droppableId.split("-")
        const dayIndex = Number.parseInt(dayIndexStr, 10)
        const slotIndex = Number.parseInt(slotIndexStr, 10)

        if (isNaN(dayIndex) || isNaN(slotIndex)) return

        const newWeekDays = [...weekDays]
        post = newWeekDays[dayIndex].slots[slotIndex].post

        if (!post) return

        // Optimistically update UI
        newWeekDays[dayIndex].slots[slotIndex].post = null
        setWeekDays(newWeekDays)

        // Save to database
        const success = await removeScheduledPost(post.id, selectedBrandKitId)

        // Revert UI if save failed
        if (!success) {
          newWeekDays[dayIndex].slots[slotIndex].post = post
          setWeekDays(newWeekDays)
          return
        }
      } else {
        const [_, dayIndexStr, slotIndexStr] = source.droppableId.split("-")
        const dayIndex = Number.parseInt(dayIndexStr, 10)
        const slotIndex = Number.parseInt(slotIndexStr, 10)

        if (isNaN(dayIndex) || isNaN(slotIndex)) return

        const newMonthDays = [...monthDays]
        post = newMonthDays[dayIndex].slots[slotIndex].post

        if (!post) return

        // Optimistically update UI
        newMonthDays[dayIndex].slots[slotIndex].post = null
        setMonthDays(newMonthDays)

        // Save to database
        const success = await removeScheduledPost(post.id, selectedBrandKitId)

        // Revert UI if save failed
        if (!success) {
          newMonthDays[dayIndex].slots[slotIndex].post = post
          setMonthDays(newMonthDays)
          return
        }
      }

      if (post) setUnscheduledPosts([...unscheduledPosts, post])
    } else {
      let sourcePost

      if (viewMode === "week") {
        const [_, sDayIndexStr, sSlotIndexStr] = source.droppableId.split("-")
        const [__, dDayIndexStr, dSlotIndexStr] = destination.droppableId.split("-")

        const sDayIndex = Number.parseInt(sDayIndexStr, 10)
        const sSlotIndex = Number.parseInt(sSlotIndexStr, 10)
        const dDayIndex = Number.parseInt(dDayIndexStr, 10)
        const dSlotIndex = Number.parseInt(dSlotIndexStr, 10)

        if (isNaN(sDayIndex) || isNaN(sSlotIndex) || isNaN(dDayIndex) || isNaN(dSlotIndex)) return

        const newWeekDays = [...weekDays]
        sourcePost = newWeekDays[sDayIndex].slots[sSlotIndex].post

        if (!sourcePost) return

        // Optimistically update UI
        newWeekDays[sDayIndex].slots[sSlotIndex].post = null
        newWeekDays[dDayIndex].slots[dSlotIndex].post = sourcePost
        setWeekDays(newWeekDays)

        const date = newWeekDays[dDayIndex].date.toISOString().split("T")[0]
        const time = newWeekDays[dDayIndex].slots[dSlotIndex].time

        // Save to database
        const success = await saveScheduledPost(sourcePost.id, date, time, selectedBrandKitId)

        // Revert UI if save failed
        if (!success) {
          newWeekDays[sDayIndex].slots[sSlotIndex].post = sourcePost
          newWeekDays[dDayIndex].slots[dSlotIndex].post = null
          setWeekDays(newWeekDays)
        }
      } else {
        const [_, sDayIndexStr, sSlotIndexStr] = source.droppableId.split("-")
        const [__, dDayIndexStr, dSlotIndexStr] = destination.droppableId.split("-")

        const sDayIndex = Number.parseInt(sDayIndexStr, 10)
        const sSlotIndex = Number.parseInt(sSlotIndexStr, 10)
        const dDayIndex = Number.parseInt(dDayIndexStr, 10)
        const dSlotIndex = Number.parseInt(dSlotIndexStr, 10)

        if (isNaN(sDayIndex) || isNaN(sSlotIndex) || isNaN(dDayIndex) || isNaN(dSlotIndex)) return

        const newMonthDays = [...monthDays]
        sourcePost = newMonthDays[sDayIndex].slots[sSlotIndex].post

        if (!sourcePost) return

        // Optimistically update UI
        newMonthDays[sDayIndex].slots[sSlotIndex].post = null
        newMonthDays[dDayIndex].slots[dSlotIndex].post = sourcePost
        setMonthDays(newMonthDays)

        const date = newMonthDays[dDayIndex].date.toISOString().split("T")[0]
        const time = newMonthDays[dDayIndex].slots[dSlotIndex].time

        // Save to database
        const success = await saveScheduledPost(sourcePost.id, date, time, selectedBrandKitId)

        // Revert UI if save failed
        if (!success) {
          newMonthDays[sDayIndex].slots[sSlotIndex].post = sourcePost
          newMonthDays[dDayIndex].slots[dSlotIndex].post = null
          setMonthDays(newMonthDays)
        }
      }
    }
  }

  const addSlot = (dayIndex: number, view: "week" | "month") => {
    if (view === "week") {
      const newWeekDays = [...weekDays]
      const newSlot = {
        id: `slot-${dayIndex}-${newWeekDays[dayIndex].slots.length}-${Date.now()}`,
        time: DEFAULT_POST_TIME, // Use the default time constant
        post: null as Post | null,
        posts: [] as Post[],
      }
      newWeekDays[dayIndex].slots.push(newSlot)
      setWeekDays(newWeekDays)
      toast({
        title: "Slot added",
        description: "New time slot added to schedule",
      })
    } else {
      const newMonthDays = [...monthDays]
      const newSlot = {
        id: `month-${dayIndex}-${newMonthDays[dayIndex].slots.length}-${Date.now()}`,
        time: DEFAULT_POST_TIME, // Use the default time constant
        post: null as Post | null,
        posts: [] as Post[],
      }
      newMonthDays[dayIndex].slots.push(newSlot)
      setMonthDays(newMonthDays)
      toast({
        title: "Slot added",
        description: "New time slot added to schedule",
      })
    }
  }

  // Replace the updateSlotTime function with this improved version that immediately updates the database
  // and ensures both views stay in sync

  const updateSlotTime = async (dayIndex: number, slotIndex: number, newTime: string, view: "week" | "month") => {
    // Validate time format (HH:MM)
    if (!/^\d{2}:\d{2}$/.test(newTime)) {
      // If invalid format, don't update
      return
    }

    if (view === "week") {
      const newWeekDays = [...weekDays]
      const oldTime = newWeekDays[dayIndex].slots[slotIndex].time
      newWeekDays[dayIndex].slots[slotIndex].time = newTime
      setWeekDays(newWeekDays)

      const date = newWeekDays[dayIndex].date.toISOString().split("T")[0]
      let postsToUpdate: Post[] = []

      // Handle single post case
      if (newWeekDays[dayIndex].slots[slotIndex].post) {
        postsToUpdate.push(newWeekDays[dayIndex].slots[slotIndex].post!)
      }

      // Handle multiple posts case
      if (newWeekDays[dayIndex].slots[slotIndex].posts && newWeekDays[dayIndex].slots[slotIndex].posts.length > 0) {
        postsToUpdate = [...postsToUpdate, ...newWeekDays[dayIndex].slots[slotIndex].posts]
      }

      // Update each post in the database
      for (const post of postsToUpdate) {
        const success = await saveScheduledPost(post.id, date, newTime, selectedBrandKitId)

        // If any update fails, revert the UI for this slot
        if (!success) {
          newWeekDays[dayIndex].slots[slotIndex].time = oldTime
          setWeekDays(newWeekDays)
          return
        }
      }

      // If successful, update the month view to keep it in sync
      const newMonthDays = [...monthDays]
      const monthDayIndex = newMonthDays.findIndex((day) => day.date.toISOString().split("T")[0] === date)

      if (monthDayIndex !== -1) {
        // Find all slots with these posts
        for (const post of postsToUpdate) {
          const monthSlotIndex = newMonthDays[monthDayIndex].slots.findIndex(
            (slot) => slot.post?.id === post.id || (slot.posts && slot.posts.some((p) => p.id === post.id)),
          )

          if (monthSlotIndex !== -1) {
            newMonthDays[monthDayIndex].slots[monthSlotIndex].time = newTime
          }
        }
        setMonthDays(newMonthDays)
      }
    } else {
      // Month view time update
      const newMonthDays = [...monthDays]
      const oldTime = newMonthDays[dayIndex].slots[slotIndex].time
      newMonthDays[dayIndex].slots[slotIndex].time = newTime
      setMonthDays(newMonthDays)

      const date = newMonthDays[dayIndex].date.toISOString().split("T")[0]
      let postsToUpdate: Post[] = []

      // Handle single post case
      if (newMonthDays[dayIndex].slots[slotIndex].post) {
        postsToUpdate.push(newMonthDays[dayIndex].slots[slotIndex].post!)
      }

      // Handle multiple posts case
      if (newMonthDays[dayIndex].slots[slotIndex].posts && newMonthDays[dayIndex].slots[slotIndex].posts.length > 0) {
        postsToUpdate = [...postsToUpdate, ...newMonthDays[dayIndex].slots[slotIndex].posts]
      }

      // Update each post in the database
      for (const post of postsToUpdate) {
        const success = await saveScheduledPost(post.id, date, newTime, selectedBrandKitId)

        // If any update fails, revert the UI for this slot
        if (!success) {
          newMonthDays[dayIndex].slots[slotIndex].time = oldTime
          setMonthDays(newMonthDays)
          return
        }
      }

      // If successful, update the week view to keep it in sync
      const newWeekDays = [...weekDays]
      const weekDayIndex = newWeekDays.findIndex((day) => day.date.toISOString().split("T")[0] === date)

      if (weekDayIndex !== -1) {
        // Find all slots with these posts
        for (const post of postsToUpdate) {
          const weekSlotIndex = newWeekDays[weekDayIndex].slots.findIndex(
            (slot) => slot.post?.id === post.id || (slot.posts && slot.posts.some((p) => p.id === post.id)),
          )

          if (weekSlotIndex !== -1) {
            newWeekDays[weekDayIndex].slots[weekSlotIndex].time = newTime
          }
        }
        setWeekDays(newWeekDays)
      }
    }
  }

  const handleDeletePost = async (postId: string, dayIndex: number, slotIndex: number, view: "week" | "month") => {
    let post: Post | null = null

    if (view === "week") {
      const newWeekDays = [...weekDays]

      // Check if post is in the single post field
      if (newWeekDays[dayIndex].slots[slotIndex].post?.id === postId) {
        post = newWeekDays[dayIndex].slots[slotIndex].post
        newWeekDays[dayIndex].slots[slotIndex].post = null
      }
      // Check if post is in the posts array
      else if (newWeekDays[dayIndex].slots[slotIndex].posts) {
        const postIndex = newWeekDays[dayIndex].slots[slotIndex].posts.findIndex((p) => p.id === postId)
        if (postIndex !== -1) {
          post = newWeekDays[dayIndex].slots[slotIndex].posts[postIndex]
          newWeekDays[dayIndex].slots[slotIndex].posts.splice(postIndex, 1)
        }
      }

      if (!post) return
      setWeekDays(newWeekDays)
    } else {
      const newMonthDays = [...monthDays]

      // Check if post is in the single post field
      if (newMonthDays[dayIndex].slots[slotIndex].post?.id === postId) {
        post = newMonthDays[dayIndex].slots[slotIndex].post
        newMonthDays[dayIndex].slots[slotIndex].post = null
      }
      // Check if post is in the posts array
      else if (newMonthDays[dayIndex].slots[slotIndex].posts) {
        const postIndex = newMonthDays[dayIndex].slots[slotIndex].posts.findIndex((p) => p.id === postId)
        if (postIndex !== -1) {
          post = newMonthDays[dayIndex].slots[slotIndex].posts[postIndex]
          newMonthDays[dayIndex].slots[slotIndex].posts.splice(postIndex, 1)
        }
      }

      if (!post) return
      setMonthDays(newMonthDays)
    }

    // Save to database
    const success = await removeScheduledPost(post.id, selectedBrandKitId)

    // Add back to unscheduled if successful
    if (success) {
      setUnscheduledPosts([...unscheduledPosts, post])
    } else {
      // Revert UI if failed
      if (view === "week") {
        const newWeekDays = [...weekDays]
        if (!newWeekDays[dayIndex].slots[slotIndex].posts) {
          newWeekDays[dayIndex].slots[slotIndex].posts = []
        }
        newWeekDays[dayIndex].slots[slotIndex].posts.push(post)
        setWeekDays(newWeekDays)
      } else {
        const newMonthDays = [...monthDays]
        if (!newMonthDays[dayIndex].slots[slotIndex].posts) {
          newMonthDays[dayIndex].slots[slotIndex].posts = []
        }
        newMonthDays[dayIndex].slots[slotIndex].posts.push(post)
        setMonthDays(newMonthDays)
      }
    }
  }

  const handleConnectInstagram = () => {
    setIsConnected(!isConnected)
    toast({
      title: isConnected ? "Instagram disconnected" : "Instagram connected",
      description: isConnected
        ? "Your Instagram account has been disconnected"
        : "Your Instagram account has been connected successfully",
    })
  }

  const handleRefresh = () => {
    if (!selectedBrandKitId) return
    fetchAndSync(selectedBrandKitId, currentDate)
    toast({
      title: "Schedule refreshed",
      description: "Your schedule has been updated with the latest data",
    })
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Top Navigation Bar */}
        <header className="border-b bg-white px-4 py-3 shadow-sm dark:bg-gray-950">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {loadingBrandKits ? (
                <Skeleton className="h-10 w-[180px]" />
              ) : (
                <Select
                  value={selectedBrandKitId}
                  onValueChange={(value) => {
                    setSelectedBrandKitId(value)
                    localStorage.setItem("selectedBrandKitId", value)
                  }}
                  className="w-full sm:w-auto"
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select Brand Kit" />
                  </SelectTrigger>
                  <SelectContent>
                    {brandKits.length === 0 ? (
                      <SelectItem value="no-kits" disabled>
                        No brand kits available
                      </SelectItem>
                    ) : (
                      brandKits.map((kit) => (
                        <SelectItem key={kit.id} value={kit.id}>
                          {kit.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
              <Button variant="outline" size="sm" onClick={goToToday} className="font-medium">
                Today
              </Button>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={navigatePrevious}
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={navigateNext} aria-label="Next">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-lg font-semibold">
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                  ...(viewMode === "week" ? { day: "numeric" } : {}),
                })}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={loadingPosts}
                className="ml-0 sm:ml-2 text-xs sm:text-sm"
              >
                {loadingPosts ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <svg
                    className="h-4 w-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                    <path d="M16 21h5v-5" />
                  </svg>
                )}
                Refresh
              </Button>
            </div>
            <div className="flex items-center gap-1 sm:gap-3">
              <Select
                value={viewMode}
                onValueChange={(value) => setViewMode(value as "week" | "month")}
                className="w-[120px] sm:w-[140px]"
              >
                <SelectTrigger className="w-[140px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week View</SelectItem>
                  <SelectItem value="month">Month View</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleConnectInstagram}
                variant={isConnected ? "outline" : "default"}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Instagram className="h-4 w-4" />
                {isConnected ? "Instagram Connected" : "Connect Instagram"}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Sidebar */}
            <aside className="flex w-full md:w-72 flex-col border-b md:border-b-0 md:border-r bg-white dark:bg-gray-900">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Unscheduled Posts</h3>
                <p className="text-sm text-muted-foreground">Drag posts to schedule them</p>
              </div>
              <Droppable droppableId="unscheduled-posts">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 overflow-y-auto p-4 ${snapshot.isDraggingOver ? "bg-primary/5" : ""}`}
                  >
                    {loadingPosts ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="rounded-lg border p-3">
                            <div className="flex gap-3">
                              <Skeleton className="h-14 w-14 rounded-md" />
                              <div className="flex-1">
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-3 w-2/3" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : unscheduledPosts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <svg
                          className="h-12 w-12 text-muted-foreground mb-2"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="18" height="18" x="3" y="3" rx="2" />
                          <path d="M9 8h7" />
                          <path d="M8 12h6" />
                          <path d="M11 16h4" />
                        </svg>
                        <h4 className="font-medium mb-1">No unscheduled posts</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Create new posts or unschedule existing ones to see them here
                        </p>
                        <Button size="sm" onClick={() => (window.location.href = "/dashboard")} className="gap-1">
                          <Plus className="h-4 w-4" /> Create Post
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {unscheduledPosts.map((post, index) => (
                          <Draggable key={post.id} draggableId={post.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`group cursor-grab rounded-lg border bg-card p-3 shadow-sm transition-all ${
                                  snapshot.isDragging ? "rotate-1 scale-105 shadow-md" : ""
                                }`}
                              >
                                <div className="flex gap-3">
                                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md">
                                    <Image
                                      src={post.image_url || "/placeholder.svg"}
                                      alt={`Post ${post.id}`}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm line-clamp-2">{post.caption}</p>
                                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                      <Badge variant="outline" className="text-[10px] px-1 py-0">
                                        Unscheduled
                                      </Badge>
                                      <span className="ml-1">Drag to schedule</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
              <div className="border-t p-4">
                <Button className="w-full" size="sm" onClick={() => (window.location.href = "/dashboard")}>
                  <Plus className="mr-2 h-4 w-4" /> Add Post
                </Button>
              </div>
            </aside>

            {/* Calendar Area */}
            <main className="flex-1 overflow-auto bg-white p-2 sm:p-4 dark:bg-gray-950">
              {viewMode === "week" ? (
                <div className="grid h-full grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2 sm:gap-4">
                  {weekDays.map((day, dayIndex) => (
                    <div
                      key={`day-${dayIndex}`}
                      className={`flex flex-col rounded-lg border ${day.isToday ? "border-primary bg-primary/5" : ""}`}
                    >
                      <div
                        className={`p-2 text-center ${day.isToday ? "font-bold text-primary" : ""}`}
                        onClick={() => handleDayClick(day.date)}
                      >
                        <p className="text-sm font-medium">{day.dayName}</p>
                        <p className="text-xl">{day.dayNumber}</p>
                        <p className="text-xs text-muted-foreground">{day.month}</p>
                      </div>
                      <div className="flex flex-1 flex-col gap-3 p-2">
                        {day.slots.map((slot, slotIndex) => (
                          <Droppable
                            key={slot.id}
                            droppableId={`slot-${dayIndex}-${slotIndex}`}
                            isDropDisabled={isPastDate(day.date)}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`flex min-h-[80px] sm:min-h-[100px] flex-col rounded-md border p-1 sm:p-2 transition-colors ${
                                  snapshot.isDraggingOver && !isPastDate(day.date)
                                    ? "border-primary/50 bg-primary/5"
                                    : isPastDate(day.date)
                                      ? "bg-gray-50 dark:bg-gray-800/50"
                                      : ""
                                } ${isPastDate(day.date) ? "opacity-70" : ""}`}
                              >
                                <div className="mb-1 flex items-center gap-2">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="text-[10px] font-medium text-muted-foreground">EST</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">Eastern Standard Time</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <Input
                                    type="text"
                                    value={slot.time}
                                    onChange={(e) => {
                                      const newWeekDays = [...weekDays]
                                      newWeekDays[dayIndex].slots[slotIndex].time = e.target.value
                                      setWeekDays(newWeekDays)
                                    }}
                                    onBlur={(e) => updateSlotTime(dayIndex, slotIndex, e.target.value, "week")}
                                    className="h-6 w-12 sm:w-16 text-[10px] sm:text-xs"
                                    disabled={isPastDate(day.date)}
                                  />
                                </div>

                                {/* Display single post (legacy support) */}
                                {slot.post && (
                                  <Draggable draggableId={`scheduled-${slot.post.id}`} index={0}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`group flex flex-col gap-2 rounded-md bg-white p-2 shadow-sm transition-all dark:bg-gray-800 ${
                                          snapshot.isDragging ? "rotate-1 scale-105 shadow-md" : ""
                                        }`}
                                      >
                                        <div className="relative h-10 sm:h-12 w-full overflow-hidden rounded-md">
                                          {slot.post && (
                                            <Image
                                              src={slot.post.image_url || "/placeholder.svg"}
                                              alt={`Post ${slot.post.id}`}
                                              fill
                                              className="object-cover"
                                            />
                                          )}
                                          <div className="absolute right-1 top-1 flex opacity-0 transition-opacity group-hover:opacity-100">
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-6 w-6 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80"
                                                  onClick={(e) => {
                                                    e.stopPropagation()
                                                    window.location.href = `/dashboard/edit/${slot.post?.id}`
                                                  }}
                                                >
                                                  <Edit2 className="h-3 w-3" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p className="text-xs">Edit post</p>
                                              </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-6 w-6 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80"
                                                  onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (slot.post) {
                                                      handleDeletePost(slot.post.id, dayIndex, slotIndex, "week")
                                                    }
                                                  }}
                                                >
                                                  <Trash2 className="h-3 w-3" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p className="text-xs">Unschedule post</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </div>
                                        </div>
                                        {slot.post && (
                                          <p className="text-[10px] sm:text-xs line-clamp-2">{slot.post.caption}</p>
                                        )}
                                      </div>
                                    )}
                                  </Draggable>
                                )}

                                {/* Display multiple posts */}
                                {slot.posts && slot.posts.length > 0 && (
                                  <div className="flex flex-col gap-2">
                                    {slot.posts.map((post, postIndex) => (
                                      <Draggable
                                        key={`multi-${post.id}`}
                                        draggableId={`scheduled-multi-${post.id}-${postIndex}`}
                                        index={postIndex}
                                      >
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`group flex flex-col gap-2 rounded-md bg-white p-2 shadow-sm transition-all dark:bg-gray-800 ${
                                              snapshot.isDragging ? "rotate-1 scale-105 shadow-md" : ""
                                            }`}
                                          >
                                            <div className="relative h-10 sm:h-12 w-full overflow-hidden rounded-md">
                                              <Image
                                                src={post.image_url || "/placeholder.svg"}
                                                alt={`Post ${post.id}`}
                                                fill
                                                className="object-cover"
                                              />
                                              <div className="absolute right-1 top-1 flex opacity-0 transition-opacity group-hover:opacity-100">
                                                <Tooltip>
                                                  <TooltipTrigger asChild>
                                                    <Button
                                                      variant="ghost"
                                                      size="icon"
                                                      className="h-6 w-6 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80"
                                                      onClick={(e) => {
                                                        e.stopPropagation()
                                                        window.location.href = `/dashboard/edit/${post.id}`
                                                      }}
                                                    >
                                                      <Edit2 className="h-3 w-3" />
                                                    </Button>
                                                  </TooltipTrigger>
                                                  <TooltipContent>
                                                    <p className="text-xs">Edit post</p>
                                                  </TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                  <TooltipTrigger asChild>
                                                    <Button
                                                      variant="ghost"
                                                      size="icon"
                                                      className="h-6 w-6 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80"
                                                      onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDeletePost(post.id, dayIndex, slotIndex, "week")
                                                      }}
                                                    >
                                                      <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                  </TooltipTrigger>
                                                  <TooltipContent>
                                                    <p className="text-xs">Unschedule post</p>
                                                  </TooltipContent>
                                                </Tooltip>
                                              </div>
                                            </div>
                                            <p className="text-[10px] sm:text-xs line-clamp-2">{post.caption}</p>
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                  </div>
                                )}

                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addSlot(dayIndex, "week")}
                          className="text-xs h-8"
                          disabled={isPastDate(day.date)}
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add Slot
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium">
                      {day}
                    </div>
                  ))}
                  {monthDays.map((day, index) => (
                    <div
                      key={`month-day-${index}`}
                      className={`min-h-[80px] sm:min-h-[120px] border p-0.5 sm:p-1 ${
                        day.isToday
                          ? "border-primary bg-primary/5"
                          : day.isCurrentMonth
                            ? ""
                            : "bg-gray-50 opacity-50 dark:bg-gray-900"
                      }`}
                      onClick={() => handleDayClick(day.date)}
                    >
                      <div className={`mb-1 text-right text-sm ${day.isToday ? "font-bold text-primary" : ""}`}>
                        {day.dayNumber}
                      </div>
                      <div className="flex flex-col gap-1">
                        {day.slots.map((slot, slotIndex) => (
                          <Droppable
                            key={slot.id}
                            droppableId={`month-${index}-${slotIndex}`}
                            isDropDisabled={isPastDate(day.date) || !!slot.post}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`min-h-[40px] ${
                                  snapshot.isDraggingOver && !isPastDate(day.date) && !slot.post
                                    ? "border-primary/50 bg-primary/5 rounded border"
                                    : ""
                                } ${isPastDate(day.date) ? "opacity-70" : ""}`}
                              >
                                {/* Single post (legacy support) */}
                                {slot.post && (
                                  <Draggable
                                    draggableId={`month-scheduled-${slot.post.id}-${index}-${slotIndex}`}
                                    index={0}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`group flex items-center gap-0.5 sm:gap-1 rounded bg-white p-0.5 sm:p-1 text-[10px] sm:text-xs shadow-sm dark:bg-gray-800 ${
                                          snapshot.isDragging ? "rotate-1 scale-105" : ""
                                        }`}
                                      >
                                        <div className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded">
                                          {slot.post && (
                                            <Image
                                              src={slot.post.image_url || "/placeholder.svg"}
                                              alt={`Post ${slot.post.id}`}
                                              fill
                                              className="object-cover"
                                            />
                                          )}
                                        </div>
                                        <Input
                                          type="text"
                                          value={slot.time}
                                          onChange={(e) => {
                                            const newMonthDays = [...monthDays]
                                            newMonthDays[index].slots[slotIndex].time = e.target.value
                                            setMonthDays(newMonthDays)
                                          }}
                                          onBlur={(e) => updateSlotTime(index, slotIndex, e.target.value, "month")}
                                          className="h-6 w-12 sm:w-16 text-[10px] sm:text-xs"
                                          disabled={isPastDate(day.date)}
                                        />
                                        <span className="text-[10px] text-muted-foreground hidden sm:inline">EST</span>
                                        <div className="ml-auto flex opacity-0 transition-opacity group-hover:opacity-100">
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-5 w-5"
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  window.location.href = `/dashboard/edit/${slot.post?.id}`
                                                }}
                                              >
                                                <Edit2 className="h-2.5 w-2.5" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p className="text-xs">Edit post</p>
                                            </TooltipContent>
                                          </Tooltip>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-5 w-5"
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  if (slot.post) {
                                                    handleDeletePost(slot.post.id, index, slotIndex, "month")
                                                  }
                                                }}
                                              >
                                                <Trash2 className="h-2.5 w-2.5" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p className="text-xs">Unschedule post</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                )}

                                {/* Multiple posts */}
                                {slot.posts && slot.posts.length > 0 && (
                                  <div className="flex flex-col gap-1 mt-1">
                                    {slot.posts.map((post, postIndex) => (
                                      <Draggable
                                        key={`month-multi-${post.id}-${postIndex}`}
                                        draggableId={`month-scheduled-multi-${post.id}-${index}-${slotIndex}-${postIndex}`}
                                        index={postIndex}
                                      >
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`group flex items-center gap-0.5 sm:gap-1 rounded bg-white p-0.5 sm:p-1 text-[10px] sm:text-xs shadow-sm dark:bg-gray-800 ${
                                              snapshot.isDragging ? "rotate-1 scale-105" : ""
                                            }`}
                                          >
                                            <div className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded">
                                              <Image
                                                src={post.image_url || "/placeholder.svg"}
                                                alt={`Post ${post.id}`}
                                                fill
                                                className="object-cover"
                                              />
                                            </div>
                                            {postIndex === 0 && (
                                              <>
                                                <Input
                                                  type="text"
                                                  value={slot.time}
                                                  onChange={(e) => {
                                                    const newMonthDays = [...monthDays]
                                                    newMonthDays[index].slots[slotIndex].time = e.target.value
                                                    setMonthDays(newMonthDays)
                                                  }}
                                                  onBlur={(e) =>
                                                    updateSlotTime(index, slotIndex, e.target.value, "month")
                                                  }
                                                  className="h-6 w-12 sm:w-16 text-[10px] sm:text-xs"
                                                  disabled={isPastDate(day.date)}
                                                />
                                                <span className="text-[10px] text-muted-foreground hidden sm:inline">
                                                  EST
                                                </span>
                                              </>
                                            )}
                                            {postIndex !== 0 && (
                                              <span className="ml-16 text-[10px] text-muted-foreground">
                                                +{postIndex}
                                              </span>
                                            )}
                                            <div className="ml-auto flex opacity-0 transition-opacity group-hover:opacity-100">
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-5"
                                                    onClick={(e) => {
                                                      e.stopPropagation()
                                                      window.location.href = `/dashboard/edit/${post.id}`
                                                    }}
                                                  >
                                                    <Edit2 className="h-2.5 w-2.5" />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  <p className="text-xs">Edit post</p>
                                                </TooltipContent>
                                              </Tooltip>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-5"
                                                    onClick={(e) => {
                                                      e.stopPropagation()
                                                      handleDeletePost(post.id, index, slotIndex, "month")
                                                    }}
                                                  >
                                                    <Trash2 className="h-2.5 w-2.5" />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  <p className="text-xs">Unschedule post</p>
                                                </TooltipContent>
                                              </Tooltip>
                                            </div>
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                  </div>
                                )}

                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        ))}
                        {day.isCurrentMonth && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              addSlot(index, "month")
                            }}
                            className="text-xs h-6 mt-1"
                            disabled={isPastDate(day.date)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        </DragDropContext>
      </div>
    </TooltipProvider>
  )
}
