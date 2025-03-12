"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { PauseIcon, PlayIcon } from "lucide-react"

interface Announcement {
  id: string
  title: string
  content: string
  status?: string
}

interface AnnouncementMarqueeProps {
  announcements: Announcement[]
}

export function AnnouncementMarquee({ announcements }: AnnouncementMarqueeProps) {
  const [isPaused, setIsPaused] = useState(false)
  const marqueeRef = useRef<HTMLDivElement>(null)

  // Handle pause/play
  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  // Apply animation styles based on pause state
  useEffect(() => {
    if (marqueeRef.current) {
      if (isPaused) {
        marqueeRef.current.style.animationPlayState = "paused"
      } else {
        marqueeRef.current.style.animationPlayState = "running"
      }
    }
  }, [isPaused])

  // Filter active announcements
  const activeAnnouncements = announcements.filter(
    (announcement) => !announcement.status || announcement.status === "active",
  )

  if (!activeAnnouncements.length) {
    return null
  }

  return (
    <div className="relative overflow-hidden bg-[#D1F3F3] py-3 px-4 rounded-md">
      <div
        ref={marqueeRef}
        className="whitespace-nowrap inline-block animate-marquee"
        style={{
          animationDuration: "30s", // Fixed duration regardless of content length
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        {activeAnnouncements.map((announcement, index) => (
          <span key={announcement.id} className="inline-block">
            <span className="font-medium">{announcement.title}</span>
            <span className="font-medium"> - {announcement.content}</span>
            {index < activeAnnouncements.length - 1 && (
              <span className="mx-6 inline-flex items-center">
                <span className="h-2 w-2 rounded-full bg-teal-600"></span>
              </span>
            )}
          </span>
        ))}
      </div>

      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
          onClick={togglePause}
          aria-label={isPaused ? "Play announcements" : "Pause announcements"}
        >
          {isPaused ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
        </Button>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation-name: marquee;
        }
      `}</style>
    </div>
  )
}

