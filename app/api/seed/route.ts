import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schema";
import { seed } from "drizzle-seed";

const db = drizzle(process.env.DATABASE_URL!);

async function clearDb() {
  await db.delete(schema.classSessions);
  await db.delete(schema.studentAttendance);
  await db.delete(schema.classStudents);

  await db.delete(schema.classes);
  await db.delete(schema.students);
  await db.delete(schema.users);
}

async function seedDb() {
  await seed(db, { users: schema.users, students: schema.students }).refine((f) => ({
    users: {
        columns: {
            name: f.fullName(),
        },
        count: 10,
    },
    students: {
        columns: {
            name: f.fullName(),
        },
    },
  }));
}

export async function GET() {
  try {
    await clearDb();
    await seedDb();
    console.log("hello world!");
    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
