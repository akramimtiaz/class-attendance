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
  students: ClassWithSessions['classStudents'];
}

export function SessionDialog({ trigger, mode, session, students }: SessionDialogProps) {
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
