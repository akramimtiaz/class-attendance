"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { TeacherWithClasses } from "@/db/actions/users"
import { Switch } from "@/components/ui/switch";
import { Badge } from '@/components/ui/badge'; 

type TeacherDialogProps = {
  trigger: React.ReactNode
  defaultMode: "create" | "edit" | "view"
  teacher: TeacherWithClasses
}

export function TeacherDialog({ trigger, defaultMode, teacher }: TeacherDialogProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<TeacherDialogProps['defaultMode']>(defaultMode);

  const toggleEditMode = () => {
    setMode((prev) => (prev === "view" ? "edit" : "view"));
  };

  const isReadOnly = mode === "view";
  const title =
    mode === "create"
      ? "Add New Teacher"
      : "Teacher Details";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <div className="flex items-center space-x-2 mt-2">
            <Label>Edit</Label>
            <Switch checked={mode === 'edit'} value={mode} onCheckedChange={toggleEditMode} />
          </div>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Teacher Name</Label>
              <Input id="name" placeholder="Enter teacher name" defaultValue={teacher?.name} disabled={isReadOnly} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="teacher@example.com"
                defaultValue={teacher?.email}
                disabled={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+1 (555) 000-0000" defaultValue={teacher?.phoneNumber ?? ''} disabled={isReadOnly} />
            </div>
          </div>

          <div className="font-semibold text-sm">Assigned Classes</div>
          {teacher?.classesAssigned.map((c) => (
            <div key={c.className} className="flex flex-row gap-2">
              <Badge>{c.className}</Badge>
            </div>
          ))}
          {!teacher?.classesAssigned?.length && (
            <Badge variant={"secondary"}>Not Assigned</Badge>
          )}

          {!isReadOnly && (
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>{mode === "create" ? "Add Teacher" : "Save Changes"}</Button>
            </div>
          )}

          {isReadOnly && (
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
