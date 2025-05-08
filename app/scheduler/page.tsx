"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Calendar, Plus, Instagram, Edit2, Trash2, Clock } from "lucide-react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { createClient } from "@/lib/supabase/client"
import type { Post, BrandKit, Database } from "@/lib/supabase/database.types"
import { getBrandKits } from "@/lib/actions/brand-kits"
import { getPosts } from "@/lib/actions/posts"
import { Input } from "@/components/ui/input"
import type { Database as SupabaseDatabase } from "@/lib/supabase/database.types"

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
        time: `${9 + j * 3}:00`,
        post: null as Post | null,
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
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthLastDay - daysFromPrevMonth + i + 1)
    days.push({
      date,
      dayNumber: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      isCurrentMonth: false,
      isToday: date.toDateString() === new Date().toDateString(),
      slots: Array.from({ length: 2 }, (_, j) => ({
        id: `month-prev-${date.getDate()}-${j}-${Date.now()}`,
        time: `${12 + j * 6}:00`,
        post: null as Post | null,
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
        time: `${12 + j * 6}:00`,
        post: null as Post | null,
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
        time: `${12 + j * 6}:00`,
        post: null as Post | null,
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
  let query = supabase.from('posts').select('*')
  if (typeof brandKitId === 'string') {
    query = query.eq('brand_kit_id', brandKitId as any)
  }
  query = query.not('scheduled_for', 'is', null)
  const { data, error } = await query
  if (error || !Array.isArray(data)) {
    console.error('Error fetching scheduled posts:', error)
    return []
  }
  return data.filter(isPost)
}

// Save scheduled post to Supabase (update post's scheduled_for and status)
// NOTE: For true EST-only storage, use 'timestamp without time zone' in your DB for scheduled_for
const saveScheduledPost = async (postId: string, date: string, time: string, brandKitId: string) => {
  const supabase = createClient()
  if (typeof postId !== 'string' || typeof brandKitId !== 'string') return
  const safeTime = time && /^\d{2}:\d{2}$/.test(time) ? time : "09:00"
  const safeDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date().toISOString().split('T')[0]
  // Save as plain string, no Date object, no timezone
  const scheduledFor = `${safeDate} ${safeTime}:00`
  const updateObj: Database["public"]["Tables"]["posts"]["Update"] = {
    scheduled_for: scheduledFor,
    status: 'scheduled',
  }
  const { error } = await supabase
    .from('posts')
    .update(updateObj)
    .eq('id', postId as any)
    .eq('brand_kit_id', brandKitId as any)
  if (error) {
    console.error('Error saving scheduled post:', error)
  }
}

// Remove scheduled post from Supabase (set scheduled_for to null and status to unscheduled)
const removeScheduledPost = async (postId: string, brandKitId: string) => {
  const supabase = createClient()
  if (typeof postId !== 'string' || typeof brandKitId !== 'string') return
  const updateObj: Database["public"]["Tables"]["posts"]["Update"] = {
    scheduled_for: null,
    status: 'unscheduled',
  }
  const { error } = await supabase
    .from('posts')
    .update(updateObj)
    .eq('id', postId as any)
    .eq('brand_kit_id', brandKitId as any)
  if (error) {
    console.error('Error removing scheduled post:', error)
  }
}

// Type guards
function isBrandKit(obj: any): obj is BrandKit {
  return obj && typeof obj === 'object' && typeof obj.id === 'string' && typeof obj.name === 'string';
}
function isPost(obj: any): obj is Post {
  return obj && typeof obj === 'object' && typeof obj.id === 'string' && typeof obj.caption === 'string' && typeof obj.image_url === 'string';
}

// Helper: Convert UTC ISO string to 24-hour EST string (HH:MM)
function utcToEst24Hour(utcIso: string) {
  if (!utcIso) return "";
  const utcDate = new Date(utcIso);
  // Subtract 5 hours for EST
  utcDate.setUTCHours(utcDate.getUTCHours() - 5);
  // Format as 24-hour time
  return utcDate.toISOString().slice(11, 16); // "HH:MM"
}

export default function SchedulerPage() {
  const [unscheduledPosts, setUnscheduledPosts] = useState<Post[]>([])
  const [brandKits, setBrandKits] = useState<BrandKit[]>([])
  const [selectedBrandKitId, setSelectedBrandKitId] = useState<string>("")
  const [weekDays, setWeekDays] = useState(generateWeekDays())
  const [monthDays, setMonthDays] = useState(generateMonthDays())
  const [isConnected, setIsConnected] = useState(false)
  const [viewMode, setViewMode] = useState<"week" | "month">("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)

  // Centralized fetch function
  const fetchAndSync = async (brandKitId: string, date: Date) => {
    setLoading(true)
    const postsRaw = await getPosts(brandKitId)
    const posts = Array.isArray(postsRaw) ? postsRaw.filter(isPost) : []
    const scheduledPostsRaw = await fetchScheduledPosts(brandKitId)
    const scheduledPosts = Array.isArray(scheduledPostsRaw) ? scheduledPostsRaw.filter(isPost) : []
    const scheduledPostIds = scheduledPosts.map(sp => sp.id)
    setUnscheduledPosts(posts.filter(isPost).filter(p => !scheduledPostIds.includes(p.id)))
    const newWeekDays = generateWeekDays(date)
    const newMonthDays = generateMonthDays(date)
    // Map scheduled posts into slots
    scheduledPosts.forEach((post) => {
      if (!isPost(post) || !post.scheduled_for) return;
      // scheduled_for = 'YYYY-MM-DD HH:MM:00+00' or 'YYYY-MM-DD HH:MM:00-05:00' or 'YYYY-MM-DD HH:MM:00'
      const [dateStr, timeStrRaw] = post.scheduled_for.split(' ');
      // Remove timezone info (e.g., +00, -05:00, Z) from time part
      const timeStr = timeStrRaw ? timeStrRaw.replace(/([\+\-Z].*)$/, '') : '';
      const time = timeStr ? timeStr.slice(0, 5) : '';
      // Week view
      newWeekDays.forEach(day => {
        const dayDateStr = day.date.toISOString().split('T')[0];
        if (dayDateStr === dateStr) {
          let slot = day.slots.find(s => s.time === time)
          if (!slot) {
            slot = { id: `slot-${day.dayNumber}-${time}`, time, post: null }
            day.slots.push(slot)
          }
          slot.post = post
        }
      })
      // Month view
      newMonthDays.forEach(day => {
        const dayDateStr = day.date.toISOString().split('T')[0];
        if (dayDateStr === dateStr) {
          let slot = day.slots.find(s => s.time === time)
          if (!slot) {
            slot = { id: `month-slot-${day.dayNumber}-${time}`, time, post: null }
            day.slots.push(slot)
          }
          slot.post = post
        }
      })
    })
    setWeekDays(newWeekDays)
    setMonthDays(newMonthDays)
    setLoading(false)
  }

  // Load brand kits on mount
  useEffect(() => {
    async function loadBrandKits() {
      const kitsRaw = await getBrandKits()
      const kits = Array.isArray(kitsRaw) ? kitsRaw.filter(isBrandKit) : []
      setBrandKits(kits)
      const firstKit = kits.find(isBrandKit)
      if (firstKit && typeof firstKit.id === 'string') {
        setSelectedBrandKitId(firstKit.id)
      }
    }
    loadBrandKits()
  }, [])

  // Fetch and sync whenever brand kit or current date changes
  useEffect(() => {
    if (!selectedBrandKitId) return
    fetchAndSync(selectedBrandKitId, currentDate)
  }, [selectedBrandKitId, currentDate])

  // Navigation handlers
  const goToToday = () => setCurrentDate(new Date())
  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }
  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  // Day selection handler
  const handleDayClick = (date: Date) => {
    setSelectedDay(date)
  }

  // Drag and drop handler (to be further improved for animation and slot highlight)
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result

    if (!destination) return

    if (source.droppableId === "unscheduled-posts" && destination.droppableId !== "unscheduled-posts") {
      const post = unscheduledPosts[source.index]
      const newUnscheduledPosts = [...unscheduledPosts]
      newUnscheduledPosts.splice(source.index, 1)
      setUnscheduledPosts(newUnscheduledPosts)

      if (viewMode === "week") {
        const [_, dayIndexStr, slotIndexStr] = destination.droppableId.split("-")
        const dayIndex = parseInt(dayIndexStr, 10)
        const slotIndex = parseInt(slotIndexStr, 10)
        const newWeekDays = [...weekDays]
        newWeekDays[dayIndex].slots[slotIndex].post = post
        setWeekDays(newWeekDays)
        const date = newWeekDays[dayIndex].date.toISOString().split('T')[0]
        const time = newWeekDays[dayIndex].slots[slotIndex].time
        if (post) saveScheduledPost(post.id, date, time, selectedBrandKitId)
      } else {
        const [_, dayIndexStr, slotIndexStr] = destination.droppableId.split("-")
        const dayIndex = parseInt(dayIndexStr, 10)
        const slotIndex = parseInt(slotIndexStr, 10)
        const newMonthDays = [...monthDays]
        if (!newMonthDays[dayIndex].slots[slotIndex].post) {
          newMonthDays[dayIndex].slots[slotIndex].post = post
          setMonthDays(newMonthDays)
          const date = newMonthDays[dayIndex].date.toISOString().split('T')[0]
          const time = newMonthDays[dayIndex].slots[slotIndex].time
          if (post) saveScheduledPost(post.id, date, time, selectedBrandKitId)
        }
      }
    } else if (destination.droppableId === "unscheduled-posts") {
      let post
      if (viewMode === "week") {
        const [_, dayIndexStr, slotIndexStr] = source.droppableId.split("-")
        const dayIndex = parseInt(dayIndexStr, 10)
        const slotIndex = parseInt(slotIndexStr, 10)
        const newWeekDays = [...weekDays]
        post = newWeekDays[dayIndex].slots[slotIndex].post
        newWeekDays[dayIndex].slots[slotIndex].post = null
        setWeekDays(newWeekDays)
        if (post) removeScheduledPost(post.id, selectedBrandKitId)
      } else {
        const [_, dayIndexStr, slotIndexStr] = source.droppableId.split("-")
        const dayIndex = parseInt(dayIndexStr, 10)
        const slotIndex = parseInt(slotIndexStr, 10)
        const newMonthDays = [...monthDays]
        post = newMonthDays[dayIndex].slots[slotIndex].post
        newMonthDays[dayIndex].slots[slotIndex].post = null
        setMonthDays(newMonthDays)
        if (post) removeScheduledPost(post.id, selectedBrandKitId)
      }
      if (post) setUnscheduledPosts([...unscheduledPosts, post])
    } else {
      let sourcePost
      if (viewMode === "week") {
        const [_, sDayIndexStr, sSlotIndexStr] = source.droppableId.split("-")
        const [__, dDayIndexStr, dSlotIndexStr] = destination.droppableId.split("-")
        const sDayIndex = parseInt(sDayIndexStr, 10)
        const sSlotIndex = parseInt(sSlotIndexStr, 10)
        const dDayIndex = parseInt(dDayIndexStr, 10)
        const dSlotIndex = parseInt(dSlotIndexStr, 10)
        const newWeekDays = [...weekDays]
        sourcePost = newWeekDays[sDayIndex].slots[sSlotIndex].post
        newWeekDays[sDayIndex].slots[sSlotIndex].post = null
        newWeekDays[dDayIndex].slots[dSlotIndex].post = sourcePost
        setWeekDays(newWeekDays)
        const date = newWeekDays[dDayIndex].date.toISOString().split('T')[0]
        const time = newWeekDays[dDayIndex].slots[dSlotIndex].time
        if (sourcePost) saveScheduledPost(sourcePost.id, date, time, selectedBrandKitId)
      } else {
        const [_, sDayIndexStr, sSlotIndexStr] = source.droppableId.split("-")
        const [__, dDayIndexStr, dSlotIndexStr] = destination.droppableId.split("-")
        const sDayIndex = parseInt(sDayIndexStr, 10)
        const sSlotIndex = parseInt(sSlotIndexStr, 10)
        const dDayIndex = parseInt(dDayIndexStr, 10)
        const dSlotIndex = parseInt(dSlotIndexStr, 10)
        const newMonthDays = [...monthDays]
        sourcePost = newMonthDays[sDayIndex].slots[sSlotIndex].post
        newMonthDays[sDayIndex].slots[sSlotIndex].post = null
        newMonthDays[dDayIndex].slots[dSlotIndex].post = sourcePost
        setMonthDays(newMonthDays)
        const date = newMonthDays[dDayIndex].date.toISOString().split('T')[0]
        const time = newMonthDays[dDayIndex].slots[dSlotIndex].time
        if (sourcePost) saveScheduledPost(sourcePost.id, date, time, selectedBrandKitId)
      }
    }
  }

  const addSlot = (dayIndex: number, view: 'week' | 'month') => {
    if (view === "week") {
      const newWeekDays = [...weekDays]
      const newSlot = {
        id: `slot-${dayIndex}-${newWeekDays[dayIndex].slots.length}-${Date.now()}`,
        time: "12:00",
        post: null as Post | null,
      }
      newWeekDays[dayIndex].slots.push(newSlot)
      setWeekDays(newWeekDays)
    } else {
      const newMonthDays = [...monthDays]
      const newSlot = {
        id: `month-${dayIndex}-${newMonthDays[dayIndex].slots.length}-${Date.now()}`,
        time: "12:00",
        post: null as Post | null,
      }
      newMonthDays[dayIndex].slots.push(newSlot)
      setMonthDays(newMonthDays)
    }
  }

  const updateSlotTime = (dayIndex: number, slotIndex: number, newTime: string, view: 'week' | 'month') => {
    if (view === "week") {
      const newWeekDays = [...weekDays]
      newWeekDays[dayIndex].slots[slotIndex].time = newTime
      if (newWeekDays[dayIndex].slots[slotIndex].post) {
        const date = newWeekDays[dayIndex].date.toISOString().split('T')[0]
        if (newWeekDays[dayIndex].slots[slotIndex].post) saveScheduledPost(newWeekDays[dayIndex].slots[slotIndex].post.id, date, newTime, selectedBrandKitId)
      }
      setWeekDays(newWeekDays)
    } else {
      const newMonthDays = [...monthDays]
      newMonthDays[dayIndex].slots[slotIndex].time = newTime
      if (newMonthDays[dayIndex].slots[slotIndex].post) {
        const date = newMonthDays[dayIndex].date.toISOString().split('T')[0]
        if (newMonthDays[dayIndex].slots[slotIndex].post) saveScheduledPost(newMonthDays[dayIndex].slots[slotIndex].post.id, date, newTime, selectedBrandKitId)
      }
      setMonthDays(newMonthDays)
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="border-b bg-white px-4 py-3 shadow-sm dark:bg-gray-950">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Select value={selectedBrandKitId} onValueChange={setSelectedBrandKitId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Brand Kit" />
              </SelectTrigger>
              <SelectContent>
                {brandKits.map((kit) => (
                  <SelectItem key={kit.id} value={kit.id}>{kit.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={goToToday}>Today</Button>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={navigatePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={navigateNext}>
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
          </div>
          <div className="flex items-center gap-3">
            <Select value={viewMode} onValueChange={(value) => setViewMode(value as 'week' | 'month')}>
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
              onClick={() => setIsConnected(!isConnected)}
              variant={isConnected ? "outline" : "default"}
              className="flex items-center gap-2"
            >
              <Instagram className="h-4 w-4" />
              {isConnected ? "Instagram Connected" : "Connect Instagram"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="flex w-72 flex-col border-r bg-gray-50 dark:bg-gray-900">
            <div className="p-4">
              <h3 className="mb-2 font-semibold">Unscheduled Posts</h3>
              <p className="text-sm text-muted-foreground">Drag posts to schedule them</p>
            </div>
            <Droppable droppableId="unscheduled-posts">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="flex-1 overflow-y-auto p-4">
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
                                  <span>Drag to schedule</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
            <div className="border-t p-4">
              <Button className="w-full" size="sm" onClick={() => window.location.href = "/dashboard"}>
                <Plus className="mr-2 h-4 w-4" /> Add Post
              </Button>
            </div>
          </aside>

          {/* Calendar Area */}
          <main className="flex-1 overflow-auto bg-white p-4 dark:bg-gray-950">
            {viewMode === "week" ? (
              <div className="grid h-full grid-cols-7 gap-4">
                {weekDays.map((day, dayIndex) => (
                  <div
                    key={`day-${dayIndex}`}
                    className={`flex flex-col rounded-lg border ${day.isToday ? "border-primary bg-primary/5" : ""}`}
                  >
                    <div className={`p-2 text-center ${day.isToday ? "font-bold text-primary" : ""}`}>
                      <p className="text-sm font-medium">{day.dayName}</p>
                      <p className="text-xl">{day.dayNumber}</p>
                      <p className="text-xs text-muted-foreground">{day.month}</p>
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-2">
                      {day.slots.map((slot, slotIndex) => (
                        <Droppable
                          key={slot.id}
                          droppableId={`slot-${dayIndex}-${slotIndex}`}
                          isDropDisabled={isPastDate(day.date) || !!slot.post}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`flex min-h-[100px] flex-col rounded-md border p-2 transition-colors ${
                                snapshot.isDraggingOver && !isPastDate(day.date) && !!slot.post ? "border-primary/50 bg-primary/5" : ""
                              } ${isPastDate(day.date) ? "opacity-50" : ""}`}
                            >
                              <div className="mb-1 flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                <Input
                                  type="text"
                                  value={slot.time}
                                  onChange={(e) => updateSlotTime(dayIndex, slotIndex, e.target.value, "week")}
                                  className="w-16 text-xs"
                                  disabled={isPastDate(day.date)}
                                />
                              </div>
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
                                      <div className="relative h-12 w-full overflow-hidden rounded-md">
                                        {slot.post && (
                                          <Image
                                            src={slot.post.image_url || "/placeholder.svg"}
                                            alt={`Post ${slot.post.id}`}
                                            fill
                                            className="object-cover"
                                          />
                                        )}
                                        <div className="absolute right-1 top-1 flex opacity-0 transition-opacity group-hover:opacity-100">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80"
                                          >
                                            <Edit2 className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80"
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                      {slot.post && (
                                        <p className="text-xs line-clamp-2">{slot.post.caption}</p>
                                      )}
                                    </div>
                                  )}
                                </Draggable>
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => addSlot(dayIndex, "week")}>
                        Add Slot
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium">{day}</div>
                ))}
                {monthDays.map((day, index) => (
                  <div
                    key={`month-day-${index}`}
                    className={`min-h-[120px] border p-1 ${
                      day.isToday
                        ? "border-primary bg-primary/5"
                        : day.isCurrentMonth
                        ? ""
                        : "bg-gray-50 opacity-50 dark:bg-gray-900"
                    }`}
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
                              className={`min-h-[40px] ${isPastDate(day.date) ? "opacity-50" : ""}`}
                            >
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
                                      className={`group flex items-center gap-1 rounded bg-white p-1 text-xs shadow-sm dark:bg-gray-800 ${
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
                                        onChange={(e) => updateSlotTime(index, slotIndex, e.target.value, "month")}
                                        className="w-16 text-xs"
                                        disabled={isPastDate(day.date)}
                                      />
                                      <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                                        <Button variant="ghost" size="icon" className="h-4 w-4">
                                          <Edit2 className="h-2 w-2" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-4 w-4">
                                          <Trash2 className="h-2 w-2" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => addSlot(index, "month")}>
                        Add Slot
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </DragDropContext>
    </div>
  )
}