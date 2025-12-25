
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
import { Checkbox } from "@/components/ui/checkbox";
import type { ClassForAssignment } from "@/db/actions/classes";

type CreateStudentDialogProps = {
  trigger: React.ReactNode;
  availableClasses: ClassForAssignment[];
};

export function CreateStudentDialog({
  trigger,
  availableClasses,
}: CreateStudentDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
        </DialogHeader>
        <form>
          <div className="grid gap-6 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid col-span-2 space-y-2">
                <Label htmlFor="customerName">Student Name</Label>
                <Input id="customerName" placeholder="Enter student name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentName">Parent Name</Label>
                <Input id="parentName" placeholder="Enter parent name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentPhoneNo">Parent Phone No.</Label>
                <Input
                  id="parentPhoneNo"
                  placeholder="Enter parent phone no."
                />
              </div>
            </div>

            <div className="font-semibold text-sm">Assign Classes</div>
            <div className="flex flex-row gap-2 flex-wrap border-amber-700">
              {availableClasses.map((option) => (
                <label className="flex flex-row gap-2 mr-4 font-normal text-sm" key={option.id}>
                  <Checkbox name="assignedClasses" value={option.id} />
                  {option.className}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              {/* update this */}
              <Button onClick={() => setOpen(false)}>Save Changes</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
