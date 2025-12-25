"use client"

import type React from "react"

import { useActionState, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { TeacherWithClasses } from "@/db/actions/users"
import { Switch } from "@/components/ui/switch";
import { Badge } from '@/components/ui/badge'; 
import { createOrUpdateTeacher, type TeacherFormState } from "@/lib/actions"

type TeacherDialogProps = {
  trigger: React.ReactNode
  teacher?: TeacherWithClasses
}

export function TeacherDialog({ trigger, teacher }: TeacherDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const isNewTeacher = !teacher;

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const initialState = { message: null, errors: {} } as TeacherFormState;
  const [state, formAction] = useActionState(createOrUpdateTeacher, initialState);

  const isReadOnly = mode === "view" && !isNewTeacher;
  const toggleEditMode = () => {
    setMode((prev) => (prev === "view" ? "edit" : "view"));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Teacher Details</DialogTitle>
          {!isNewTeacher && (
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
              <Input
                id="id"
                type="hidden"
                name="id"
                defaultValue={teacher?.id}
              />
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">Teacher Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={teacher?.name ?? ""}
                  placeholder="Enter teacher name"
                  disabled={isReadOnly}
                  aria-describedby="name-error"
                />
                <div id="name-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.name &&
                    state.errors.name.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="teacher@example.com"
                  defaultValue={teacher?.email}
                  readOnly={!isNewTeacher}
                  aria-describedby="email-error"
                />
                <div id="email-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.email &&
                    state.errors.email.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="0400 000 000"
                  defaultValue={teacher?.phoneNumber ?? ""}
                  disabled={isReadOnly}
                  aria-describedby="phoneNumber-error"
                />
                <div id="phoneNumber-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.phoneNumber &&
                    state.errors.phoneNumber.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>
            </div>

            {!isNewTeacher && (
              <div>
                <div className="font-semibold text-sm">Assigned Classes</div>
                {teacher?.classesAssigned.map((c) => (
                  <div key={c.className} className="flex flex-row gap-2">
                    <Badge>{c.className}</Badge>
                  </div>
                ))}
                {!teacher?.classesAssigned?.length && (
                  <Badge variant={"secondary"}>Not Assigned</Badge>
                )}
              </div>
            )}

            {!isReadOnly && (
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
