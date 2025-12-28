"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Calendar1,
  Eye,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { ClassWithSessions } from "@/db/actions/classes";
import day from 'dayjs';
import { AttendanceDialog } from "./attendance-dialog";
import { ClassDialog } from "./class-dialog";
import { ClassSessionDialog } from "./class-session-dialog";
import { EditSessionDialog } from "./edit-session-dialog";
import { DeleteSessionDialog } from "./delete-session-dialog";
import { CancelSessionDialog } from "./cancel-session-dialog";
import { ViewAttendanceDialog } from "./view-attendance-dialog";
import type { TeacherForAssignment } from "@/db/actions/users";

type ClassComponentProps = {
  classItem: ClassWithSessions;
  availableTeachers: TeacherForAssignment[];
}

export default function ClassComponent({ classItem, availableTeachers }: ClassComponentProps) {
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
        <CardHeader>
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
              <ClassDialog
                classItem={classItem}
                availableTeachers={availableTeachers}
                trigger={
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                }
              />
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
                <ClassSessionDialog
                  classId={classItem.id}
                  dayOfWeek={classItem.dayOfWeek}
                  defaultTeacherId={classItem.assignedTeacherId}
                  availableTeachers={availableTeachers}
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
                        <div className="font-medium">{day(session.sessionDate).format('dddd, MMMM D, YYYY')}</div>
                        {session.markedBy && (
                          <span className="text-xs text-muted-foreground">
                            Marked by {session.markedBy.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {!!session?.markedAt ? (
                        <>
                          {day(session.sessionDate).isBefore(day(), "day") && (
                            <ViewAttendanceDialog
                              className={classItem.className}
                              sessionId={session.id}
                              sessionDate={session.sessionDate}
                              trigger={
                                <Button variant="outline" size="sm">
                                  View Attendance
                                </Button>
                              }
                            />
                          )}
                          <Badge variant="default">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        </>
                      ) : null}
                      {!session?.markedAt &&
                      (day(session.sessionDate).isSame(day(), "day") ||
                        day(session.sessionDate).isAfter(day(), "day")) ? (
                        <>
                          <AttendanceDialog
                            className={classItem.className}
                            students={classItem.classStudents}
                            sessionId={session.id}
                            trigger={
                              <Button variant="outline" size="sm">
                                Mark Attendance
                              </Button>
                            }
                          />
                          <EditSessionDialog
                            session={session}
                            availableTeachers={availableTeachers}
                            trigger={
                              <Button variant="outline" size="sm">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            }
                          />
                          {(day(session.sessionDate).isSame(day(), "day") ||
                            day(session.sessionDate).isAfter(day(), "day")) && (
                            <CancelSessionDialog
                              sessionId={session.id}
                              sessionDate={session.sessionDate}
                              trigger={
                                <Button variant="outline" size="sm">
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              }
                            />
                          )}
                          <DeleteSessionDialog
                            sessionId={session.id}
                            sessionDate={session.sessionDate}
                            trigger={
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <Badge variant="outline">
                            <Calendar1 className="h-4 w-4 mr-1" />
                            Scheduled
                          </Badge>
                        </>
                      ) : null}
                      {session.cancelled && (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Cancelled
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
  );
}
