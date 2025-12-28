"use client"

import type React from "react"

import { useActionState, useRef, useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClassSession, ClassSessionFormState } from "@/lib/actions"
import type { TeacherForAssignment } from "@/db/actions/users"
import { dayOfWeekEnum } from "@/db/schema"
import day from 'dayjs';
import weekday from 'dayjs/plugin/weekday';

day.extend(weekday);

type DayOfWeek = typeof dayOfWeekEnum.enumValues[number]

type ClassSessionDialogProps = {
  trigger: React.ReactNode
  classId: string
  dayOfWeek: DayOfWeek
  defaultTeacherId: string
  availableTeachers: TeacherForAssignment[]
}

function getNextOccurrenceOfDay(dayOfWeek: DayOfWeek): string {
  const dayMap = dayOfWeekEnum.enumValues.reduce((acc, d, index) => {
    return {
      ...acc,
      [d]: index + 1,
    };
  }, {} as Record<DayOfWeek, number>);

  const today = day().day();
  const targetDayNum = dayMap[dayOfWeek];

  if ((today === 0 && dayOfWeek === 'SUNDAY') || today === targetDayNum) {
    return day().format('YYYY-MM-DD');
  }
  
  return day().weekday(targetDayNum).format('YYYY-MM-DD');
}

export function ClassSessionDialog({
  trigger,
  classId,
  dayOfWeek,
  defaultTeacherId,
  availableTeachers,
}: ClassSessionDialogProps) {
  const formRef = useRef<HTMLFormElement>(null)

  const [open, setOpen] = useState(false)

  const initialState = { message: null, errors: {} } as ClassSessionFormState
  const [state, formAction] = useActionState(createClassSession, initialState)

  const defaultSessionDate = useMemo(() => getNextOccurrenceOfDay(dayOfWeek), [dayOfWeek])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Session</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={formAction}>
          <div className="grid gap-6 py-4">
            <Input id="classId" type="hidden" name="classId" value={classId} />
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sessionDate">Session Date</Label>
                <Input
                  id="sessionDate"
                  name="sessionDate"
                  type="date"
                  defaultValue={defaultSessionDate}
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
                  defaultValue={defaultTeacherId}
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

            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false)
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
  )
}

