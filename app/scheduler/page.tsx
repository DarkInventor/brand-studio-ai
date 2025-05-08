"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Calendar, Plus, Instagram, Edit2, Trash2, Clock } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { createClient } from "@/lib/supabase/client"
import type { Post, BrandKit } from "@/lib/supabase/database.types"
import { getBrandKits } from "@/lib/actions/brand-kits"
import { getPosts } from "@/lib/actions/posts"

// Generate days for the current week
const generateWeekDays = () => {
  const today = new Date()
  const day = today.getDay() // 0 is Sunday, 6 is Saturday
  const diff = today.getDate() - day + (day === 0 ? -6 : 1) // Adjust to start from Monday

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(diff + i)
    return {
      date,
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      isToday: date.toDateString() === today.toDateString(),
      slots: Array.from({ length: 4 }, (_, j) => ({
        id: `slot-${i}-${j}`,
        time: `${9 + j * 3}:00`,
        post: null,
      })),
    }
  })
}

// Generate days for the current month
const generateMonthDays = () => {
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  let firstDayOfWeek = firstDay.getDay()
  // Adjust for Monday as first day of week
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

  // Calculate days from previous month to show
  const daysFromPrevMonth = firstDayOfWeek

  // Calculate total days to show (previous month days + current month days)
  const totalDays = daysFromPrevMonth + lastDay.getDate()

  // Calculate rows needed (7 days per row)
  const rows = Math.ceil(totalDays / 7)

  // Generate all days to display
  const days = []

  // Previous month days
  const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate()
  for (let i = 0; i < daysFromPrevMonth; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - 1, prevMonthLastDay - daysFromPrevMonth + i + 1)
    days.push({
      date,
      dayNumber: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      isCurrentMonth: false,
      isToday: date.toDateString() === today.toDateString(),
      slots: Array.from({ length: 2 }, (_, j) => ({
        id: `month-prev-${i}-${j}`,
        time: `${12 + j * 6}:00`,
        post: null,
      })),
    })
  }

  // Current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), i)
    days.push({
      date,
      dayNumber: i,
      month: date.toLocaleDateString("en-US", { month: "short" }),
      isCurrentMonth: true,
      isToday: date.toDateString() === today.toDateString(),
      slots: Array.from({ length: 2 }, (_, j) => ({
        id: `month-current-${i}-${j}`,
        time: `${12 + j * 6}:00`,
        post: null,
      })),
    })
  }

  // Next month days to fill the grid
  const remainingDays = rows * 7 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() + 1, i)
    days.push({
      date,
      dayNumber: i,
      month: date.toLocaleDateString("en-US", { month: "short" }),
      isCurrentMonth: false,
      isToday: date.toDateString() === today.toDateString(),
      slots: Array.from({ length: 2 }, (_, j) => ({
        id: `month-next-${i}-${j}`,
        time: `${12 + j * 6}:00`,
        post: null,
      })),
    })
  }

  return days
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

  useEffect(() => {
    async function loadBrandKitsAndPosts() {
      const kitsRaw = await getBrandKits();
      const kits = (kitsRaw || []).filter(
        (k: any): k is BrandKit =>
          k && typeof k === 'object' && typeof k.id === 'string' && typeof k.name === 'string'
      ) as unknown as BrandKit[];
      setBrandKits(kits);
      if (kits.length > 0) {
        setSelectedBrandKitId(kits[0].id);
        const postsRaw = await getPosts(kits[0].id);
        const posts = (postsRaw || []).filter(
          (p: any): p is Post =>
            p && typeof p === 'object' && typeof p.id === 'string' && typeof p.caption === 'string' && typeof p.image_url === 'string'
        ) as unknown as Post[];
        setUnscheduledPosts(posts);
      }
    }
    loadBrandKitsAndPosts();
  }, []);

  useEffect(() => {
    if (!selectedBrandKitId) return;
    async function loadPosts() {
      const postsRaw = await getPosts(selectedBrandKitId);
      const posts = (postsRaw || []).filter(
        (p: any): p is Post =>
          p && typeof p === 'object' && typeof p.id === 'string' && typeof p.caption === 'string' && typeof p.image_url === 'string'
      ) as unknown as Post[];
      setUnscheduledPosts(posts);
    }
    loadPosts();
  }, [selectedBrandKitId]);

  const handleDragEnd = (result: any) => {
    const { source, destination } = result

    // Dropped outside the list
    if (!destination) {
      return
    }

    // Handle different drag and drop scenarios
    if (source.droppableId === "unscheduled-posts") {
      // Moving from unscheduled posts to calendar
      if (destination.droppableId !== "unscheduled-posts") {
        // Copy the post
        const sourcePost = unscheduledPosts[source.index]

        // Remove from unscheduled posts
        const newUnscheduledPosts = [...unscheduledPosts]
        newUnscheduledPosts.splice(source.index, 1)
        setUnscheduledPosts(newUnscheduledPosts)

        // Update the calendar slot
        if (viewMode === "week") {
          const [dayIndex, slotIndex] = destination.droppableId.split("-").slice(1).map(Number)
          const newWeekDays = [...weekDays]
          newWeekDays[dayIndex].slots[slotIndex].post = sourcePost && typeof sourcePost === 'object' && typeof sourcePost.id === 'string' ? sourcePost : null;
          setWeekDays(newWeekDays)
        } else {
          // Handle month view
          const parts = destination.droppableId.split("-")
          const monthType = parts[1] // prev, current, or next
          const dayIndex = Number.parseInt(parts[2])
          const slotIndex = Number.parseInt(parts[3])

          const newMonthDays = [...monthDays]
          let targetIndex = 0

          if (monthType === "prev") {
            targetIndex = dayIndex
          } else if (monthType === "current") {
            targetIndex = dayIndex - 1
          } else {
            const today = new Date()
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
            targetIndex = newMonthDays.length - (lastDay.getDate() - dayIndex) - 1
          }

          newMonthDays[targetIndex].slots[slotIndex].post = sourcePost && typeof sourcePost === 'object' && typeof sourcePost.id === 'string' ? sourcePost : null;
          setMonthDays(newMonthDays)
        }
      }
    } else {
      // Moving from calendar to unscheduled posts or another calendar slot
      // This would require more complex logic to handle both week and month views
      // For simplicity, we'll just implement the basic functionality
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setWeekDays(generateWeekDays())
    setMonthDays(generateMonthDays())
  }

  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
    // In a real app, you would regenerate the days based on the new date
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
    // In a real app, you would regenerate the days based on the new date
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="border-b bg-white px-4 py-3 shadow-sm dark:bg-gray-950">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Brand Kit Selector */}
            <Select value={selectedBrandKitId} onValueChange={setSelectedBrandKitId}>
              <SelectTrigger className="w-[180px]">
                {/* <span className="mr-2">Brand Kit:</span> */}
                <SelectValue placeholder="Select Brand Kit" />
              </SelectTrigger>
              <SelectContent>
                {brandKits.map((kit) => (
                  <SelectItem key={kit.id} value={kit.id}>{kit.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
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
            <Select value={viewMode} onValueChange={(value: "week" | "month") => setViewMode(value)}>
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
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="flex w-72 flex-col border-r bg-gray-50 dark:bg-gray-900">
          <div className="p-4">
            <h3 className="mb-2 font-semibold">Unscheduled Posts</h3>
            <p className="text-sm text-muted-foreground">Drag posts to schedule them</p>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="unscheduled-posts">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-3">
                    {unscheduledPosts.filter((post) => post && typeof post === 'object' && typeof post.id === 'string').map((post, index) => (
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
          </DragDropContext>

          <div className="border-t p-4">
            <Button className="w-full" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Post
            </Button>
          </div>
        </aside>

        {/* Calendar Area */}
        <main className="flex-1 overflow-auto bg-white p-4 dark:bg-gray-950">
          <DragDropContext onDragEnd={handleDragEnd}>
            {viewMode === "week" ? (
              /* Week View */
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
                        <Droppable key={slot.id} droppableId={`slot-${dayIndex}-${slotIndex}`}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`flex min-h-[100px] flex-col rounded-md border p-2 transition-colors ${
                                snapshot.isDraggingOver ? "border-primary/50 bg-primary/5" : ""
                              }`}
                            >
                              <div className="mb-1 flex items-center text-xs font-medium text-muted-foreground">
                                <Clock className="mr-1 h-3 w-3" />
                                {slot.time}
                              </div>

                              {slot.post && typeof slot.post === 'object' && typeof slot.post.id === 'string' ? (
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
                                        <Image
                                          src={slot.post.image_url || "/placeholder.svg"}
                                          alt={`Post ${slot.post.id}`}
                                          fill
                                          className="object-cover"
                                        />
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
                                      <p className="text-xs line-clamp-2">{slot.post.caption}</p>
                                    </div>
                                  )}
                                </Draggable>
                              ) : (
                                <div className="flex flex-1 items-center justify-center rounded-md border border-dashed p-2 text-xs text-muted-foreground">
                                  Drop post here
                                </div>
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Month View */
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium">
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
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
                          key={`${index}-${slotIndex}`}
                          droppableId={`month-${day.isCurrentMonth ? "current" : day.dayNumber < 15 ? "prev" : "next"}-${day.dayNumber}-${slotIndex}`}
                        >
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-[40px]">
                              {slot.post && typeof slot.post === 'object' && typeof slot.post.id === 'string' ? (
                                <Draggable
                                  draggableId={`month-scheduled-${slot.post.id}-${index}-${slotIndex}`}
                                  index={0}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="group flex items-center gap-1 rounded bg-white p-1 text-xs shadow-sm dark:bg-gray-800"
                                    >
                                      <div className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded">
                                        <Image
                                          src={slot.post.image_url || "/placeholder.svg"}
                                          alt={`Post ${slot.post.id}`}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                      <span className="flex-1 truncate">{slot.time}</span>
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
                              ) : (
                                <div className="hidden h-[40px] items-center justify-center rounded border border-dashed text-[10px] text-muted-foreground hover:flex">
                                  {slot.time}
                                </div>
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DragDropContext>
        </main>
      </div>
    </div>
  )
}
