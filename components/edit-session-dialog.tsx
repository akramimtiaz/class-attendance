"use client"

import type React from "react"

import { useActionState, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateClassSession, deleteClassSession, UpdateSessionFormState, DeleteSessionFormState } from "@/lib/actions"
import type { TeacherForAssignment } from "@/db/actions/users"
import { Trash2 } from "lucide-react"

type EditSessionDialogProps = {
  trigger: React.ReactNode
  session: {
    id: string
    teacherId: string
    sessionDate: string
  }
  availableTeachers: TeacherForAssignment[]
}

export function EditSessionDialog({
  trigger,
  session,
  availableTeachers,
}: EditSessionDialogProps) {
  const updateFormRef = useRef<HTMLFormElement>(null)
  const deleteFormRef = useRef<HTMLFormElement>(null)

  const [open, setOpen] = useState(false)

  const updateInitialState = { message: null, errors: {} } as UpdateSessionFormState
  const [updateState, updateFormAction] = useActionState(updateClassSession, updateInitialState)

  const deleteInitialState = { message: null } as DeleteSessionFormState
  const [deleteState, deleteFormAction] = useActionState(deleteClassSession, deleteInitialState)

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this session?")) {
      deleteFormRef.current?.requestSubmit()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent showCloseButton={false} className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Edit Session</DialogTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {deleteState.message && (
            <p className="text-sm text-red-500 mt-2" aria-live="polite">
              {deleteState.message}
            </p>
          )}
        </DialogHeader>
        
        {/* Hidden delete form - separate from update form */}
        <form ref={deleteFormRef} action={deleteFormAction} className="hidden">
          <Input type="hidden" name="sessionId" value={session.id} />
        </form>

        <form ref={updateFormRef} action={updateFormAction}>
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
                  {updateState.errors?.sessionDate &&
                    updateState.errors.sessionDate.map((error: string) => (
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
                  {updateState.errors?.teacherId &&
                    updateState.errors.teacherId.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>
            </div>

            {updateState.message && (
              <div className="text-sm text-red-500" aria-live="polite">
                {updateState.message}
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

