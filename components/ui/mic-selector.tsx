"use client"

import * as React from "react"
import { Check, Mic } from "lucide-react"
import { cn } from "@/lib/utils"

interface AudioDevice {
  deviceId: string
  label: string
}

interface MicSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedDeviceId?: string
  onDeviceChange?: (deviceId: string) => void
}

const MicSelector = React.forwardRef<HTMLDivElement, MicSelectorProps>(
  ({ className, selectedDeviceId, onDeviceChange, ...props }, ref) => {
    const [devices, setDevices] = React.useState<AudioDevice[]>([])
    const [isOpen, setIsOpen] = React.useState(false)
    const [hasPermission, setHasPermission] = React.useState(false)

    React.useEffect(() => {
      const loadDevices = async () => {
        try {
          // Request permission first
          await navigator.mediaDevices.getUserMedia({ audio: true })
          setHasPermission(true)

          const deviceList = await navigator.mediaDevices.enumerateDevices()
          const audioInputs = deviceList
            .filter((device) => device.kind === "audioinput")
            .map((device) => ({
              deviceId: device.deviceId,
              label: device.label || `Microphone ${device.deviceId.slice(0, 5)}`,
            }))

          setDevices(audioInputs)
        } catch (error) {
          console.error("Error accessing microphones:", error)
          setHasPermission(false)
        }
      }

      loadDevices()

      // Listen for device changes
      navigator.mediaDevices.addEventListener("devicechange", loadDevices)
      return () => {
        navigator.mediaDevices.removeEventListener("devicechange", loadDevices)
      }
    }, [])

    const selectedDevice = devices.find((d) => d.deviceId === selectedDeviceId)

    if (!hasPermission) {
      return (
        <div ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props}>
          Microphone access required
        </div>
      )
    }

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted",
            "focus:outline-none focus:ring-2 focus:ring-ring"
          )}
        >
          <Mic className="h-4 w-4" />
          <span className="min-w-0 flex-1 truncate text-left">
            {selectedDevice?.label || "Select microphone"}
          </span>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full z-20 mt-1 w-full min-w-[200px] rounded-md border bg-popover p-1 shadow-md">
              {devices.map((device) => (
                <button
                  key={device.deviceId}
                  type="button"
                  onClick={() => {
                    onDeviceChange?.(device.deviceId)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent",
                    selectedDeviceId === device.deviceId && "bg-accent"
                  )}
                >
                  <div className="flex h-4 w-4 items-center justify-center">
                    {selectedDeviceId === device.deviceId && (
                      <Check className="h-4 w-4" />
                    )}
                  </div>
                  <span className="flex-1 truncate text-left">{device.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }
)
MicSelector.displayName = "MicSelector"

export { MicSelector, type AudioDevice }
