"use client"

import { useEffect, useState, useRef } from "react";
import { BellRing } from "lucide-react";
import { cn } from "@/lib/utils";

interface Announcement {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface AnnouncementMarqueeProps {
  announcements: Announcement[];
}

export function AnnouncementMarquee({ announcements }: AnnouncementMarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (marqueeRef.current) {
      marqueeRef.current.style.animationPlayState = isPaused ? "paused" : "running";
    }
  }, [isPaused]);

  if (!announcements.length) return null;

  return (
    <div
      className="bg-[#1BC2C2] text-white py-2 px-4 relative overflow-hidden rounded-lg mb-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center">
        <div className="flex items-center gap-2 min-w-[200px]">
          <BellRing className="h-4 w-4" />
          <span className="font-medium">Announcements</span>
        </div>
        <div className="relative overflow-hidden flex-1">
          <div
            ref={marqueeRef}
            className={cn(
              "whitespace-nowrap inline-block animate-marquee hover:[animation-play-state:paused]",
              "flex items-center gap-8"
            )}
          >
            {announcements.map((announcement, index) => (
              <span key={`${announcement.id}-${index}`} className="inline-block px-4">
                <span className="font-medium">{announcement.title}</span>
                <span className="text-white/90"> - {announcement.content}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


