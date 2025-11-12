"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: "user" | "assistant" | "system"
  timestamp?: Date | string
  showTimestamp?: boolean
  avatar?: React.ReactNode
}

const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  (
    {
      className,
      role = "user",
      timestamp,
      showTimestamp = false,
      avatar,
      children,
      ...props
    },
    ref
  ) => {
    const isUser = role === "user"
    const formattedTime = timestamp
      ? typeof timestamp === "string"
        ? timestamp
        : timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : null

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-3",
          isUser ? "flex-row-reverse" : "flex-row",
          className
        )}
        {...props}
      >
        {avatar && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
            {avatar}
          </div>
        )}

        <div
          className={cn(
            "flex flex-col gap-1",
            isUser ? "items-end" : "items-start"
          )}
        >
          <div
            className={cn(
              "rounded-2xl px-4 py-2 text-sm",
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            )}
          >
            {children}
          </div>

          {showTimestamp && formattedTime && (
            <span className="px-1 text-xs text-muted-foreground">
              {formattedTime}
            </span>
          )}
        </div>
      </div>
    )
  }
)
Message.displayName = "Message"

export { Message }
