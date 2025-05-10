"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

const press = [
  "TheNewYorkTimes",
  "TheWashingtonPost",
  "Forbes",
  "Bloomberg",
  "BusinessInsider",
  "TechCrunch",
  "TheGuardian",
  "Wired",
]

export function PressSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let scrollPosition = 0
    const scrollSpeed = 0.5
    const containerWidth = scrollContainer.scrollWidth

    const scroll = () => {
      scrollPosition += scrollSpeed
      if (scrollPosition >= containerWidth / 2) {
        scrollPosition = 0
      }
      if (scrollContainer) {
        scrollContainer.scrollLeft = scrollPosition
      }
      animationId = requestAnimationFrame(scroll)
    }

    animationId = requestAnimationFrame(scroll)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <section className="w-full py-12 md:py-16 bg-white">
      <div className="container px-4 md:px-6">
        <h3 className="text-center text-sm font-semibold text-gray-500 tracking-wider mb-8">FEATURED IN</h3>
        <div className="relative overflow-hidden">
          <div ref={scrollRef} className="flex items-center gap-12 overflow-hidden whitespace-nowrap">
            {/* Duplicate logos for infinite scroll effect */}
            {[...press, ...press].map((logo, idx) => (
              <div key={idx} className="flex-shrink-0">
                <Image
                  src={`https://cdn.magicui.design/press/${logo}.svg`}
                  width={120}
                  height={40}
                  alt={`${logo} logo`}
                  className="h-8 w-auto opacity-60  transition-all hover:opacity-100 hover:grayscale-0"
                />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 h-full w-1/4 bg-gradient-to-r from-white to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/4 bg-gradient-to-l from-white to-transparent"></div>
        </div>
      </div>
    </section>
  )
}
