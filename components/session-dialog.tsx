"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClassWithSessions } from "@/db/actions/classes"

type SessionDialogProps = {
  trigger: React.ReactNode
  mode: "create" | "mark-status"
  session: ClassWithSessions['classSessions'][number];
}

export function SessionDialog({ trigger, mode, session }: SessionDialogProps) {
  const [open, setOpen] = useState(false)

  const title =
    mode === "create" ? "Schedule New Session" : mode === "mark-status" ? "Update Session Status" : "Session Details"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {mode === "create" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="session-date">Session Date</Label>
                <Input id="session-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-time">Session Time</Label>
                <Input id="session-time" type="time" />
              </div>
            </>
          )}

          {mode === "mark-status" && (
            <>
              <div className="space-y-2">
                <Label>Session Date</Label>
                <div className="text-sm text-muted-foreground">{session?.date}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={session?.status}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="holiday">Holiday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>{mode === "create" ? "Schedule Session" : "Update Status"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
