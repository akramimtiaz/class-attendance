"use server";

import { eq } from "drizzle-orm";
// import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { classStudents } from "@/db/schema";

export async function getStudentsByClass(classId: string) {
  return db.query.classStudents.findMany({
    where: eq(classStudents.classId, classId),
    with: {
      student: true,
    },
  });
}
