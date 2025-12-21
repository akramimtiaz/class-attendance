"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type StudentWithClasses } from "@/db/actions/students"
import { Badge } from "./ui/badge"

type StudentDialogProps = {
  trigger: React.ReactNode
  mode: "create" | "edit" | "view"
  student: StudentWithClasses  
}

export function StudentDialog({ trigger, mode, student }: StudentDialogProps) {
  const [open, setOpen] = useState(false);

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
            <div className="grid col-span-2 space-y-2">
              <Label htmlFor="name">Student Name</Label>
              <Input
                id="name"
                placeholder="Enter student name"
                defaultValue={student?.name}
                disabled={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent">Parent Name</Label>
              <Input
                id="parentName"
                placeholder="Enter parent name"
                defaultValue={student?.guardianName ?? ""}
                disabled={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent">Parent Phone No.</Label>
              <Input
                id="parentPhoneNo"
                placeholder="Enter parent phone no."
                defaultValue={student?.guardianContact ?? ""}
                disabled={isReadOnly}
              />
            </div>
          </div>
          
          <div className="font-semibold text-sm">
            Assigned Classes
          </div>
          {student?.classStudents.map((c) => (
            <div key={c.id} className="grid gap-4 md:grid-cols-2">
              <Badge>{c.class.className}</Badge>
              <div className="font-normal text-sm space-y-2">
                {c.enrolledAt.toDateString()}
              </div>
            </div>
          ))}

          {!isReadOnly && (
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>
                {mode === "create" ? "Add Student" : "Save Changes"}
              </Button>
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
  );
}
