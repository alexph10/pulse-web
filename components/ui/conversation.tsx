"use client"

import * as React from "react"
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom"
import { ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConversationProps extends React.ComponentPropsWithoutRef<typeof StickToBottom> {
  className?: string
}

const Conversation = React.forwardRef<
  React.ElementRef<typeof StickToBottom>,
  ConversationProps
>(({ className, initial = "smooth", resize = "smooth", ...props }, ref) => (
  <StickToBottom
    ref={ref}
    className={cn("relative flex h-full flex-col overflow-hidden", className)}
    initial={initial}
    resize={resize}
    {...props}
  />
))
Conversation.displayName = "Conversation"

const ConversationContent = React.forwardRef<
  React.ElementRef<typeof StickToBottom.Content>,
  React.ComponentPropsWithoutRef<typeof StickToBottom.Content>
>(({ className, ...props }, ref) => (
  <StickToBottom.Content
    ref={ref}
    className={cn("flex flex-col gap-4 overflow-y-auto p-4", className)}
    {...props}
  />
))
ConversationContent.displayName = "ConversationContent"

interface ConversationEmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  icon?: React.ReactNode
}

const ConversationEmptyState = React.forwardRef<
  HTMLDivElement,
  ConversationEmptyStateProps
>(({ className, title = "No messages yet", description, icon, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center",
      className
    )}
    {...props}
  >
    {children || (
      <>
        {icon && <div className="mb-2 text-muted-foreground">{icon}</div>}
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </>
    )}
  </div>
))
ConversationEmptyState.displayName = "ConversationEmptyState"

const ConversationScrollButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext()

  if (isAtBottom) return null

  return (
    <button
      ref={ref}
      onClick={scrollToBottom}
      className={cn(
        "absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl",
        className
      )}
      {...props}
    >
      <ArrowDown className="h-5 w-5" />
      <span className="sr-only">Scroll to bottom</span>
    </button>
  )
})
ConversationScrollButton.displayName = "ConversationScrollButton"

export {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
}
