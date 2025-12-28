"use client"

import type React from "react"

import { useActionState, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateClassSession, UpdateSessionFormState } from "@/lib/actions"
import type { TeacherForAssignment } from "@/db/actions/users"

type EditSessionDialogProps = {
  trigger: React.ReactNode
  session: {
    id: string
    teacherId: string
    sessionDate: string
    createdBy?: {
      id: string
      name: string
    } | null
  }
  availableTeachers: TeacherForAssignment[]
}

export function EditSessionDialog({
  trigger,
  session,
  availableTeachers,
}: EditSessionDialogProps) {
  const formRef = useRef<HTMLFormElement>(null)

  const [open, setOpen] = useState(false)

  const initialState = { message: null, errors: {} } as UpdateSessionFormState
  const [state, formAction] = useActionState(updateClassSession, initialState)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Session</DialogTitle>
          {session.createdBy && (
            <p className="text-sm text-muted-foreground mt-1">
              Created by {session.createdBy.name}
            </p>
          )}
        </DialogHeader>

        <form ref={formRef} action={formAction}>
          <div className="grid gap-6 py-4">
            <Input id="id" type="hidden" name="id" value={session.id} />
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sessionDate">Session Date</Label>
                <Input
                  id="sessionDate"
                  name="sessionDate"
                  type="date"
                  defaultValue={session.sessionDate}
                  placeholder="Select session date"
                  aria-describedby="sessionDate-error"
                />
                <div id="sessionDate-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.sessionDate &&
                    state.errors.sessionDate.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="teacherId">Assigned Teacher</Label>
                <Select
                  name="teacherId"
                  defaultValue={session.teacherId}
                >
                  <SelectTrigger id="teacherId" aria-describedby="teacher-error">
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
                  {state.errors?.teacherId &&
                    state.errors.teacherId.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>
            </div>

            {state.message && (
              <div className="text-sm text-red-500" aria-live="polite">
                {state.message}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

