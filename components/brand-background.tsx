import type React from "react"
import { cn } from "@/lib/utils"

interface BrandBackgroundProps {
  children: React.ReactNode
  className?: string
}

export function BrandBackground({ children, className = "" }: BrandBackgroundProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute inset-0 opacity-[0.15] bg-[url('/images/neural-pattern.png')] bg-center bg-repeat" />
      <div className="relative">{children}</div>
    </div>
  )
}
