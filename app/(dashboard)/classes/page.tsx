"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ClassDialog } from "@/components/class-dialog";
import { SessionDialog } from "@/components/session-dialog";
import {
  Plus,
  Users,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  CalendarX,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { classes } from "@/lib/constants";

export default function ClassesPage() {
  const [openClasses, setOpenClasses] = useState<Record<number, boolean>>({});

  const toggleClass = (classId: number) => {
    setOpenClasses((prev) => ({ ...prev, [classId]: !prev[classId] }));
  };
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Classes</h1>
          <p className="text-muted-foreground mt-1">
            Manage classes, sessions, and attendance
          </p>
        </div>
        <ClassDialog
          mode="create"
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Class
            </Button>
          }
        />
      </div>

      <div className="space-y-4">
        {classes.map((classItem) => (
          <Card key={classItem.id}>
            <Collapsible
              open={openClasses[classItem.id]}
              onOpenChange={() => toggleClass(classItem.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {classItem.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl text-balance">
                        {classItem.name}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4" />
                          {classItem.teacher}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {classItem.schedule}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4" />
                          {classItem.students} students
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm">
                        <span className="mr-2">Sessions</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            openClasses[classItem.id] ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Class Sessions</h3>
                      <SessionDialog
                        mode="create"
                        trigger={
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Session
                          </Button>
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      {classItem.sessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card"
                        >
                          <div className="flex items-center gap-4">
                            <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
                            <div>
                              <div className="font-medium">{session.date}</div>
                              {session.status === "completed" && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  Present: {session.present} • Absent:{" "}
                                  {session.absent}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {session.status === "completed" && (
                              <Badge variant="default" className="bg-accent">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                            {session.status === "scheduled" && (
                              <>
                                <Badge variant="secondary">Scheduled</Badge>
                                <SessionDialog
                                  mode="mark-status"
                                  session={session}
                                  trigger={
                                    <Button variant="outline" size="sm">
                                      Mark Status
                                    </Button>
                                  }
                                />
                              </>
                            )}
                            {session.status === "cancelled" && (
                              <Badge variant="destructive">
                                <XCircle className="h-3 w-3 mr-1" />
                                Cancelled
                              </Badge>
                            )}
                            {session.status === "holiday" && (
                              <Badge variant="outline">
                                <CalendarX className="h-3 w-3 mr-1" />
                                Holiday
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </main>
  );
}
