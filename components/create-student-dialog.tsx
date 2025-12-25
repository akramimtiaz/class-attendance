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
import { Checkbox } from "@/components/ui/checkbox";
import { createStudent, State } from "@/lib/actions";
import type { ClassForAssignment } from "@/db/actions/classes";

type CreateStudentDialogProps = {
  trigger: React.ReactNode;
  availableClasses: ClassForAssignment[];
};

export function CreateStudentDialog({
  trigger,
  availableClasses,
}: CreateStudentDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);

  const initialState = { message: null, errors: {} } as State;
  const [state, formAction] = useActionState(createStudent, initialState);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={formAction}>
          <div className="grid gap-6 py-4 items-stretch">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Student Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter student name"
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
              <div className="space-y-2">
                <Label htmlFor="age">Student Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  step={1}
                  placeholder="Enter student age"
                  aria-describedby="age-error"
                />
                <div id="age-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.age &&
                    state.errors.age.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianName">Parent Name</Label>
                <Input
                  id="guardianName"
                  name="guardianName"
                  placeholder="Enter parent name"
                  aria-describedby="guardian-name-error"
                />
                <div
                  id="guardian-name-error"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {state.errors?.guardianName &&
                    state.errors.guardianName.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianContact">Parent Phone No.</Label>
                <Input
                  id="guardianContact"
                  name="guardianContact"
                  placeholder="Enter parent phone no."
                  aria-describedby="guardian-contact-error"
                />
                <div
                  id="guardian-contact-error"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {state.errors?.guardianContact &&
                    state.errors.guardianContact.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>
            </div>

            <div className="font-semibold text-sm">Assign Classes</div>
            <div className="flex flex-row gap-2 flex-wrap border-amber-700">
              {availableClasses.map((option) => (
                <label
                  className="flex flex-row gap-2 mr-4 font-normal text-sm"
                  key={option.id}
                >
                  <Checkbox name="assignedClasses" value={option.id} />
                  {option.className}
                </label>
              ))}
              <div id="classes-error" aria-live="polite" aria-atomic="true">
                {state.errors?.assignedClasses &&
                  state.errors.assignedClasses.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
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
  );
}
