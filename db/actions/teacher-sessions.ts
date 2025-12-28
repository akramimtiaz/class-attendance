"use server";

import { eq, or, desc } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { classSessions, classes } from "@/db/schema";

const itemsPerPageTeacher = 20;

export type TeacherSession = Awaited<ReturnType<typeof getTeacherSessions>>[number];

export async function getTeacherSessions(
  teacherId: string,
  page: number = 1,
  limit: number = itemsPerPageTeacher
) {
  const offset = (page - 1) * limit;

  // Get sessions where:
  // 1. User is the assigned teacher on the session (session.teacherId)
  // 2. User is the primary teacher of the class (class.assignedTeacherId)
  const sessions = await db.query.classSessions.findMany({
    where: or(
      eq(classSessions.teacherId, teacherId)
    ),
    with: {
      class: {
        columns: {
          id: true,
          className: true,
          dayOfWeek: true,
          assignedTeacherId: true,
        },
      },
      teacher: {
        columns: {
          id: true,
          name: true,
        },
      },
      createdBy: {
        columns: {
          id: true,
          name: true,
        },
      },
      markedBy: {
        columns: {
          id: true,
          name: true,
        },
      },
      attendance: {
        with: {
          student: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: desc(classSessions.sessionDate),
    limit,
    offset,
  });

  // Also need to get sessions for classes where the user is the primary teacher
  const primaryTeacherSessions = await db.query.classes.findMany({
    where: eq(classes.assignedTeacherId, teacherId),
    with: {
      classSessions: {
        with: {
          class: {
            columns: {
              id: true,
              className: true,
              dayOfWeek: true,
              assignedTeacherId: true,
            },
          },
          teacher: {
            columns: {
              id: true,
              name: true,
            },
          },
          createdBy: {
            columns: {
              id: true,
              name: true,
            },
          },
          markedBy: {
            columns: {
              id: true,
              name: true,
            },
          },
          attendance: {
            with: {
              student: {
                columns: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      classStudents: {
        with: {
          student: {
            columns: {
              id: true,
              name: true,
              age: true,
            },
          },
        },
      },
    },
  });

  // Flatten and merge the sessions
  const allSessions = [...sessions];
  
  primaryTeacherSessions.forEach((cls) => {
    cls.classSessions.forEach((session) => {
      // Avoid duplicates - check if session already exists
      if (!allSessions.find((s) => s.id === session.id)) {
        allSessions.push(session);
      }
    });
  });

  // Sort by session date descending
  allSessions.sort((a, b) => {
    const dateA = new Date(a.sessionDate);
    const dateB = new Date(b.sessionDate);
    return dateB.getTime() - dateA.getTime();
  });

  // Apply pagination
  const paginatedSessions = allSessions.slice(offset, offset + limit);

  // Get student list for each session's class
  const sessionsWithStudents = await Promise.all(
    paginatedSessions.map(async (session) => {
      const classData = await db.query.classes.findFirst({
        where: eq(classes.id, session.classId),
        with: {
          classStudents: {
            with: {
              student: {
                columns: {
                  id: true,
                  name: true,
                  age: true,
                },
              },
            },
          },
        },
      });

      return {
        ...session,
        students: classData?.classStudents.map((cs) => cs.student) || [],
      };
    })
  );

  return sessionsWithStudents;
}

export async function getTotalTeacherSessionsCount(teacherId: string) {
  // Get sessions where user is assigned
  const directSessions = await db.query.classSessions.findMany({
    where: eq(classSessions.teacherId, teacherId),
    columns: {
      id: true,
    },
  });

  // Get sessions for classes where user is primary teacher
  const primaryClasses = await db.query.classes.findMany({
    where: eq(classes.assignedTeacherId, teacherId),
    with: {
      classSessions: {
        columns: {
          id: true,
        },
      },
    },
  });

  const primarySessionIds = new Set(
    primaryClasses.flatMap((cls) => cls.classSessions.map((s) => s.id))
  );
  const directSessionIds = new Set(directSessions.map((s) => s.id));

  // Merge unique session IDs
  const allSessionIds = new Set([...primarySessionIds, ...directSessionIds]);

  return allSessionIds.size;
}

