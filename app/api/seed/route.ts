import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schema";
import { seed, reset } from "drizzle-seed";

const classNames = [
  "Beginner Quran",
  "Intermediate Quran",
  "Beginner Tajweed",
  "Intermediate Tajweed",
  "Islamic Studies 1",
  "Islamic Studies 2",
];

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
  await seed(db, dbSchema).refine(
    (f) => ({
      users: {
        columns: {
          name: f.fullName(),
          role: f.default({ defaultValue: 'teacher' }),
          isActive: f.default({ defaultValue: true }),
          isDeleted: f.default({ defaultValue: false }),
          deletedAt: f.default({ defaultValue: null }),
        },
        count: 10,
      },
      students: {
        columns: {
          name: f.fullName(),
          isActive: f.default({ defaultValue: true }),
          isDeleted: f.default({ defaultValue: false }),
          deletedAt: f.default({ defaultValue: null })
        },
        count: 30,
      },
      classes: {
        count: 5,
        columns: {
          className: f.valuesFromArray({ values: classNames, isUnique: true }),
          dayOfWeek: f.default({ defaultValue: 'SUNDAY' }),
          isActive: f.default({ defaultValue: true }),
          isDeleted: f.default({ defaultValue: false }),
          deletedAt: f.default({ defaultValue: null })
        }
      },
      classStudents: {
        count: 50,
      },
      classSessions: {
        count: 50,
        columns: {
          cancelled: f.default({ defaultValue: false }),
          cancelReason: f.default({ defaultValue: null }),
          sessionDate: f.date({
            minDate: new Date('2025-11-11'),
            maxDate: new Date('2026-02-02'),
          }),
        }
      },
      studentAttendance: {
        count: 50,
      }
    })
  );
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
