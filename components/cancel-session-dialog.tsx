"use client"

import type React from "react"
import { useActionState, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cancelClassSession, CancelSessionFormState } from "@/lib/actions"
import { XCircle } from "lucide-react"

type CancelSessionDialogProps = {
  trigger: React.ReactNode
  sessionId: string
  sessionDate: string
}

export function CancelSessionDialog({
  trigger,
  sessionId,
  sessionDate,
}: CancelSessionDialogProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [open, setOpen] = useState(false)
  const [charCount, setCharCount] = useState(0)

  const initialState = { message: null } as CancelSessionFormState
  const [state, formAction] = useActionState(cancelClassSession, initialState)

  const handleCancel = () => {
    formRef.current?.requestSubmit()
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Session</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <form ref={formRef} action={formAction}>
            <Input type="hidden" name="sessionId" value={sessionId} />
            <div className="mb-4">
              <Textarea
                id="cancelReason"
                name="cancelReason"
                placeholder="Enter the reason for cancellation..."
                maxLength={300}
                onChange={handleTextChange}
                className="min-h-24"
                required
              />
              {state.errors?.cancelReason && (
                <p className="text-sm text-red-500 mt-2 mb-4" aria-live="polite">
                  {state.errors.cancelReason.join(", ")}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleCancel}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Session
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

