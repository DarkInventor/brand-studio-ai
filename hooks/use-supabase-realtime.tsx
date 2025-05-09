"use client"

import { useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

type RealtimeProps = {
  table: string
  filter?: Record<string, any>
  onInsert?: () => void
  onUpdate?: () => void
  onDelete?: () => void
}

export function useSupabaseRealtime({ table, filter, onInsert, onUpdate, onDelete }: RealtimeProps) {
  const channelRef = useRef<RealtimeChannel | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Clean up previous subscription if it exists
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }

    if (!table) return

    // Create a new channel with the table name
    let channel = supabase.channel(`public:${table}`)

    // Configure the channel with the appropriate filters
    let filterString = "*"
    if (filter) {
      const filterEntries = Object.entries(filter)
      if (filterEntries.length > 0) {
        const filterConditions = filterEntries.map(([key, value]) => `${key}=eq.${value}`).join(",")
        filterString = filterConditions
      }
    }

    // Add event handlers
    if (onInsert) {
      channel = channel.on("postgres_changes", { event: "INSERT", schema: "public", table, filter: filterString }, () =>
        onInsert(),
      )
    }

    if (onUpdate) {
      channel = channel.on("postgres_changes", { event: "UPDATE", schema: "public", table, filter: filterString }, () =>
        onUpdate(),
      )
    }

    if (onDelete) {
      channel = channel.on("postgres_changes", { event: "DELETE", schema: "public", table, filter: filterString }, () =>
        onDelete(),
      )
    }

    // Subscribe to the channel
    channelRef.current = channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log(`Subscribed to realtime changes on ${table}`)
      }
    })

    // Clean up on unmount
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [table, filter, onInsert, onUpdate, onDelete, supabase])
}
