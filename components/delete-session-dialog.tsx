"use client"

import type React from "react"
import { useActionState, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { deleteClassSession, DeleteSessionFormState } from "@/lib/actions"
import { Trash2 } from "lucide-react"

type DeleteSessionDialogProps = {
  trigger: React.ReactNode
  sessionId: string
  sessionDate: string
}

export function DeleteSessionDialog({
  trigger,
  sessionId,
  sessionDate,
}: DeleteSessionDialogProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [open, setOpen] = useState(false)

  const initialState = { message: null } as DeleteSessionFormState
  const [state, formAction] = useActionState(deleteClassSession, initialState)

  const handleDelete = () => {
    formRef.current?.requestSubmit()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Session</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Are you sure you want to delete this session? This action cannot be undone.
          </p>
          
          {state.message && (
            <p className="text-sm text-red-500 mb-4" aria-live="polite">
              {state.message}
            </p>
          )}

          <form ref={formRef} action={formAction}>
            <Input type="hidden" name="sessionId" value={sessionId} />
            
            <div className="flex justify-end gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Session
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

