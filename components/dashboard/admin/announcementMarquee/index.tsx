"use client"

import { useEffect, useState, useRef } from "react"
import { BellRing } from "lucide-react"
import { getAnnouncements } from "@/lib/api/admin/announcement/fetchannouncement"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { cn } from "@/lib/utils"

interface Announcement {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export function AnnouncementMarquee() {
  const [isPaused, setIsPaused] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [error, setError] = useState<string | null>(null)
  const token = useSelector((state: RootState) => state.auth?.token)
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!token) return
      
      try {
        const response = await getAnnouncements(token)
        setAnnouncements(response.data.announcements)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch announcements")
      }
    }

    fetchAnnouncements()
  }, [token])

  // const togglePause = () => {
  //   setIsPaused(!isPaused)
  // }

  useEffect(() => {
    if (marqueeRef.current) {
      marqueeRef.current.style.animationPlayState = isPaused ? "paused" : "running"
    }
  }, [isPaused])

  if (!announcements.length || error) return null

  return (
    <div className="bg-[#1BC2C2] text-white py-2 px-4 relative overflow-hidden rounded-lg mb-4">
      <div className="flex items-center">
        <div className="flex items-center gap-2 min-w-[200px]">
          <BellRing className="h-4 w-4" />
          <span className="font-medium">Announcements</span>
        </div>|
        <div className="relative overflow-hidden flex-1">
          <div
            ref={marqueeRef}
            className={cn(
              "whitespace-nowrap inline-block animate-marquee hover:[animation-play-state:paused]",
              "flex items-center gap-8"
            )}
          >
            {[...announcements, ...announcements].map((announcement, index) => (
              <span 
                key={`${announcement.id}-${index}`}
                className="inline-block px-4"
              >
                <span className="font-medium">{announcement.title}</span>
                <span className="text-white/90"> - {announcement.content}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

