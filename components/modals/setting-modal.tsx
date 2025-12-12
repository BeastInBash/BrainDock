'use client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "../mode-toggle"
import { useSettings } from "@/hooks/use-setting"
export const SettingsModal = () => {
  const setting = useSettings();
  return (
    <Dialog open={setting.isOpen} onOpenChange={setting.onClose}>
      <DialogContent>
        <DialogTitle className="hidden">My Settings</DialogTitle>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">My Settings</h2>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <Label>
              Appearance
            </Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Rice Your Tracker.
            </span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>

    </Dialog>
  )
} 
