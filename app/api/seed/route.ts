import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schema";
import { reset } from "drizzle-seed";
import { seedData } from "@/db/seed-data";
import day from 'dayjs';
import weekday from 'dayjs/plugin/weekday';

day.extend(weekday);

const db = drizzle(process.env.DATABASE_URL!);

const dbSchema = {
  users: schema.users,
  students: schema.students,
  classes: schema.classes,
  classStudents: schema.classStudents,
  classSessions: schema.classSessions,
  studentAttendance: schema.studentAttendance, 
};

async function seedDb() {
  const admins = seedData.admins;
  const teachers = seedData.teachers;

  const [admin] = await db
    .insert(schema.users)
    .values(
      admins.map((a) => ({
        ...a,
        role: schema.userRoleEnum.enumValues[0],
        hashedPassword: "password",
      }))
    ).returning();

  for (const teacher of teachers) {
    const [insertedTeacher] = await db
      .insert(schema.users)
      .values({
        ...teacher,
        role: schema.userRoleEnum.enumValues[1],
        hashedPassword: "password",
      })
      .returning();


    for (const classItem of teacher.classes) {
      const [insertedClass] = await db.insert(schema.classes).values({
        className: classItem.className,
        dayOfWeek: schema.dayOfWeekEnum.enumValues[6],
        assignedTeacherId: insertedTeacher.id,
      }).returning();

      const insertedStudents = await db.insert(schema.students).values(
        classItem.students.map((studentName) => ({
          name: studentName,
          age: Math.floor(Math.random() * (15 - 10 + 1)) + 10,
          guardianName: 'Ahmed Rayyan',
          guardianContact: '0400 000 000',
        }))
      ).returning();

      await db.insert(schema.classStudents).values(
        insertedStudents.map((student) => ({
          classId: insertedClass.id,
          studentId: student.id,
          enrolledAt: day().subtract(2, 'month').toDate(),
        }))
      );

      const sessionDates = [
        day().weekday(-14),
        day().weekday(-7),
        day().weekday(7),
      ];

      const sessions = await db.insert(schema.classSessions).values(
        sessionDates.map(sd => ({
          classId: insertedClass.id,
          teacherId: insertedTeacher.id,
          sessionDate: day(sd).format('YYYY-MM-DD'),
          createdBy: admin.id,
          markedAt: day(sd).isAfter(day(), 'day') ? null : day(sd).toDate(),
          markedBy: day(sd).isAfter(day(), 'day') ? null : insertedTeacher.id, 
        }))
      ).returning();

      for (const session of sessions) {
        if (session.markedAt) {
          await db.insert(schema.studentAttendance).values(
            insertedStudents.map((student) => ({
              sessionId: session.id,
              studentId: student.id,
              attended: Math.random() < 0.5,
              markedByUserId: insertedTeacher.id,
              markedAt: day(session.markedAt).toDate(),
             }))
          )
        }
      }
    }
  }
}

export async function GET() {
  try {
    await reset(db, dbSchema);
    await seedDb();
    return Response.json({ message: "Database seeded successfully!" });
  } catch (error) {
    console.error('error', error);
    return Response.json({ error }, { status: 500 });
  }
}
