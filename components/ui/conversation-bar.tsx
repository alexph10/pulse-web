"use client"

import * as React from "react"
import { Mic, Send, Square } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConversationBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string
  onChange?: (value: string) => void
  onSend?: (message: string) => void
  onVoiceStart?: () => void
  onVoiceStop?: () => void
  isRecording?: boolean
  disabled?: boolean
  placeholder?: string
  showVoiceButton?: boolean
}

const ConversationBar = React.forwardRef<HTMLDivElement, ConversationBarProps>(
  (
    {
      className,
      value,
      onChange,
      onSend,
      onVoiceStart,
      onVoiceStop,
      isRecording = false,
      disabled = false,
      placeholder = "Type a message...",
      showVoiceButton = true,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState("")
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    const currentValue = value !== undefined ? value : internalValue
    const setCurrentValue = onChange || setInternalValue

    const handleSend = () => {
      if (!currentValue.trim() || disabled) return
      onSend?.(currentValue)
      setCurrentValue("")
      textareaRef.current?.focus()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    }

    const handleVoiceToggle = () => {
      if (isRecording) {
        onVoiceStop?.()
      } else {
        onVoiceStart?.()
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-end gap-2 border-t bg-background p-4",
          className
        )}
        {...props}
      >
        {showVoiceButton && (
          <button
            type="button"
            onClick={handleVoiceToggle}
            disabled={disabled}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition-colors",
              isRecording
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {isRecording ? (
              <Square className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
            <span className="sr-only">
              {isRecording ? "Stop recording" : "Start recording"}
            </span>
          </button>
        )}

        <textarea
          ref={textareaRef}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            "flex-1 resize-none bg-muted px-4 py-3 text-sm rounded-md",
            "focus:outline-none focus:ring-2 focus:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "max-h-32 overflow-y-auto"
          )}
          style={{
            minHeight: "2.5rem",
            lineHeight: "1.5",
          }}
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!currentValue.trim() || disabled}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition-colors",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </button>
      </div>
    )
  }
)
ConversationBar.displayName = "ConversationBar"

export { ConversationBar }
