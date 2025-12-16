"use server";

import { eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

export async function getUserById(id: string) {
  const user = await db.select().from(users).where(eq(users.id, id));

  return user;
};

export async function getUserByEmail(email: string) {
  const user = await db.select().from(users).where(eq(users.email, email));

  return user;
};

export async function createUser() {
    // do something
    return null;
}

export async function updateUser() {
    // do something
    return null;
}