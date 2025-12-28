"use client";

import type React from "react";

import { useActionState, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createClassSession,
  ClassSessionFormState,
} from "@/lib/actions";
import dayjs from "dayjs";

type TeacherClass = {
  id: string;
  className: string;
};

type TeacherSessionDialogProps = {
  trigger: React.ReactNode;
  teacherClasses: TeacherClass[];
  currentUserId: string;
};

export function TeacherSessionDialog({
  trigger,
  teacherClasses,
  currentUserId,
}: TeacherSessionDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [open, setOpen] = useState(false);

  const initialState = { message: null, errors: {} } as ClassSessionFormState;
  const [state, formAction] = useActionState(createClassSession, initialState);

  // Get today's date in YYYY-MM-DD format as minimum date
  const today = dayjs().format("YYYY-MM-DD");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Session</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={formAction}>
          <div className="grid gap-6 py-4">
            <Input
              id="teacherId"
              type="hidden"
              name="teacherId"
              value={currentUserId}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="classId">Class</Label>
                <Select name="classId">
                  <SelectTrigger id="classId" aria-describedby="class-error">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {teacherClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div id="class-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.classId &&
                    state.errors.classId.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionDate">Session Date</Label>
                <Input
                  id="sessionDate"
                  name="sessionDate"
                  type="date"
                  min={today}
                  defaultValue={today}
                  placeholder="Select session date"
                  aria-describedby="sessionDate-error"
                />
                <div
                  id="sessionDate-error"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {state.errors?.sessionDate &&
                    state.errors.sessionDate.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>
            </div>

            {state.message && (
              <div
                className="p-3 rounded-lg bg-red-50 border border-red-200"
                aria-live="polite"
              >
                <p className="text-sm text-red-600">{state.message}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Create Session</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

