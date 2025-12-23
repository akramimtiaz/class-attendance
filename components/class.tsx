"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SessionDialog } from "@/components/session-dialog";
import {
  Plus,
  Users,
  Clock,
  Calendar,
  CheckCircle,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { ClassWithSessions } from "@/db/actions/classes";

type ClassComponentProps = {
  classItem: ClassWithSessions;
}

export default function ClassComponent({ classItem }: ClassComponentProps) {
  const [openClasses, setOpenClasses] = useState<Record<string, boolean>>({});

  const toggleClass = (classId: string) => {
    setOpenClasses((prev) => ({ ...prev, [classId]: !prev[classId] }));
  };

  return (
    <Card>
      <Collapsible
        open={openClasses[classItem.id]}
        onOpenChange={() => toggleClass(classItem.id)}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {classItem.className
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl text-balance">
                  {classItem.className}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {classItem.assignedTeacher.name}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {classItem.dayOfWeek
                      .split("")
                      .map((l, idx) =>
                        idx == 0 ? l.toUpperCase() : l.toLowerCase()
                      )
                      .join("")}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {classItem.classStudents.length} Students
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
                {classItem.classSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-4">
                      <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div>
                        <div className="font-medium">{session.sessionDate}</div>
                        {/* {!!session.markedAt && (
                          <div className="text-sm text-muted-foreground mt-1">
                            Present: {session.present} • Absent:{" "}
                            {session.absent}
                          </div>
                        )} */}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {!!session.markedAt && (
                        <Badge variant="default" className="bg-accent">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                      {!session.markedAt && (
                        <>
                          <Badge variant="secondary">Scheduled</Badge>
                          {/* <SessionDialog
                            mode="mark-status"
                            session={session}
                            trigger={
                              <Button variant="outline" size="sm">
                                Mark Status
                              </Button>
                            }
                          /> */}
                        </>
                      )}
                      {/* {session.isCancelled && (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Cancelled
                        </Badge>
                      )} */}
                      {/* {session.status === "holiday" && (
                        <Badge variant="outline">
                          <CalendarX className="h-3 w-3 mr-1" />
                          Holiday
                        </Badge>
                      )} */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
