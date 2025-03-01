import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MessageItemProps {
  sender: "admin" | "user"
  content: string
  timestamp: string
}

export function MessageItem({ sender, content, timestamp }: MessageItemProps) {
  return (
    <div className={`flex ${sender === "admin" ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex ${sender === "admin" ? "flex-row-reverse" : "flex-row"} items-start max-w-3/4`}>
        <Avatar className="w-8 h-8 mr-2">
          <AvatarImage src={sender === "admin" ? "/admin-avatar.png" : "/user-avatar.png"} />
          <AvatarFallback>{sender === "admin" ? "A" : "U"}</AvatarFallback>
        </Avatar>
        <div className={`rounded-lg p-3 ${sender === "admin" ? "bg-blue-100" : "bg-gray-100"}`}>
          <p className="text-sm">{content}</p>
          <p className="text-xs text-gray-500 mt-1">{timestamp}</p>
        </div>
      </div>
    </div>
  )
}

