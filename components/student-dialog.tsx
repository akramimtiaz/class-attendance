"use client";

import type React from "react";

import { useState } from "react";
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
import { type StudentWithClasses } from "@/db/actions/students";
import { Badge } from "./ui/badge";
import { Switch } from "@/components/ui/switch";
import type { ClassForAssignment } from "@/db/actions/classes";
import { Checkbox } from "./ui/checkbox";

type StudentDialogProps = {
  trigger: React.ReactNode;
  student: StudentWithClasses;
  availableClasses: ClassForAssignment[];
};

export function StudentDialog({
  trigger,
  student,
  availableClasses,
}: StudentDialogProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const toggleEditMode = () => {
    setMode((prev) => (prev === "view" ? "edit" : "view"));
  };

  const isReadOnly = mode === "view";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
          <div className="flex items-center space-x-2 mt-2">
            <Label>Edit</Label>
            <Switch
              checked={mode === "edit"}
              value={mode}
              onCheckedChange={toggleEditMode}
            />
          </div>
        </DialogHeader>
        <form>
          <div className="grid gap-6 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                type="hidden"
                id="id"
                name="id"
                defaultValue={student.id}
              />
              <div className="grid space-y-2">
                <Label htmlFor="name">Student Name</Label>
                <Input
                  id="name"
                  placeholder="Enter student name"
                  defaultValue={student?.name}
                  disabled={isReadOnly}
                />
              </div>
              <div className="grid space-y-2">
                <Label htmlFor="name">Student Age</Label>
                <Input
                  type="number"
                  id="age"
                  placeholder="Enter student age"
                  defaultValue={student?.age}
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

            <div className="font-semibold text-sm">Assigned Classes</div>
            <div className="flex flex-row gap-2 flex-wrap border-amber-700">
              {availableClasses.map((option) => (
                <label
                  className="flex flex-row gap-2 mr-4 font-normal text-sm"
                  key={option.id}
                >
                  <Checkbox
                    disabled={isReadOnly}
                    checked={student.classStudents.some(
                      (cs) => cs.classId === option.id
                    )}
                    name="assignedClasses"
                    value={option.id}
                  />
                  {option.className}
                </label>
              ))}
            </div>

            {!isReadOnly && (
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setOpen(false)}>Save Changes</Button>
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
