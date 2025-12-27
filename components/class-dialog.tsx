"use client"

import type React from "react"

import { useActionState, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createOrUpdateClass, ClassFormState } from "@/lib/actions"
import type { ClassWithSessions } from "@/db/actions/classes"
import type { TeacherForAssignment } from "@/db/actions/users"
import { dayOfWeekEnum } from "@/db/schema"

type ClassDialogProps = {
  trigger: React.ReactNode
  classItem?: ClassWithSessions
  availableTeachers: TeacherForAssignment[]
}

export function ClassDialog({ trigger, classItem, availableTeachers }: ClassDialogProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const isNewClass = !classItem

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'view' | 'edit'>('view')

  const initialState = { message: null, errors: {} } as ClassFormState
  const [state, formAction] = useActionState(createOrUpdateClass, initialState)

  const isReadOnly = mode === "view" && !isNewClass
  const toggleEditMode = () => {
    setMode((prev) => (prev === "view" ? "edit" : "view"))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isNewClass ? "Create New Class" : "Class Details"}
          </DialogTitle>
          {!isNewClass && (
            <div className="flex items-center space-x-2 mt-2">
              <Label>Edit</Label>
              <Switch
                checked={mode === "edit"}
                value={mode}
                onCheckedChange={toggleEditMode}
              />
            </div>
          )}
        </DialogHeader>
        <form ref={formRef} action={formAction}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input id="id" type="hidden" name="id" defaultValue={classItem?.id} />
              <div className="space-y-2">
                <Label htmlFor="className">Class Name</Label>
                <Input
                  id="className"
                  name="className"
                  defaultValue={classItem?.className ?? ""}
                  placeholder="e.g., Beginner Quran"
                  disabled={isReadOnly}
                  aria-describedby="className-error"
                />
                <div id="className-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.className &&
                    state.errors.className.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedTeacherId">Assigned Teacher</Label>
                <Select
                  name="assignedTeacherId"
                  defaultValue={classItem?.assignedTeacherId ?? ""}
                  disabled={isReadOnly}
                >
                  <SelectTrigger id="assignedTeacherId" aria-describedby="teacher-error">
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTeachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div id="teacher-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.assignedTeacherId &&
                    state.errors.assignedTeacherId.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dayOfWeek">Class Day</Label>
                <Select
                  name="dayOfWeek"
                  defaultValue={classItem?.dayOfWeek ?? ""}
                  disabled={isReadOnly}
                >
                  <SelectTrigger id="dayOfWeek" aria-describedby="day-error">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {dayOfWeekEnum.enumValues.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day
                          .split("")
                          .map((l, idx) =>
                            idx === 0 ? l.toUpperCase() : l.toLowerCase()
                          )
                          .join("")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div id="day-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.dayOfWeek &&
                    state.errors.dayOfWeek.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              {isReadOnly ? (
                <div className="flex justify-end gap-3 mt-4">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Close
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setOpen(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {isNewClass ? "Create Class" : "Save Changes"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
