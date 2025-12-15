"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type StudentDialogProps = {
  trigger: React.ReactNode
  mode: "create" | "edit" | "view"
  student?: {
    id: number
    name: string
    parentName: string
    email: string
    phone: string
    class: string
    enrolledDate: string
  }
}

export function StudentDialog({ trigger, mode, student }: StudentDialogProps) {
  const [open, setOpen] = useState(false)

  const isReadOnly = mode === "view"
  const title = mode === "create" ? "Add New Student" : mode === "edit" ? "Edit Student" : "Student Details"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Student Name</Label>
              <Input id="name" placeholder="Enter student name" defaultValue={student?.name} disabled={isReadOnly} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent">Parent/Guardian Name</Label>
              <Input
                id="parent"
                placeholder="Enter parent name"
                defaultValue={student?.parentName}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                defaultValue={student?.email}
                disabled={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+1 (555) 000-0000" defaultValue={student?.phone} disabled={isReadOnly} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="class">Assigned Class</Label>
              <Select defaultValue={student?.class} disabled={isReadOnly}>
                <SelectTrigger id="class">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner-quran">Beginner Quran</SelectItem>
                  <SelectItem value="intermediate-tajweed">Intermediate Tajweed</SelectItem>
                  <SelectItem value="advanced-memorization">Advanced Memorization</SelectItem>
                  <SelectItem value="arabic-language">Arabic Language</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="enrolled">Enrollment Date</Label>
              <Input id="enrolled" type="date" defaultValue={student?.enrolledDate} disabled={isReadOnly} />
            </div>
          </div>

          {!isReadOnly && (
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>{mode === "create" ? "Add Student" : "Save Changes"}</Button>
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
