"use server";
import z from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createOrUpdateStudentWithClasses } from "@/db/actions/students";

export type State = {
  errors?: {
    name?: string[];
    age?: string[];
    guardianName?: string[];
    guardianContact?: string[];
    assignedClasses?: string[];
  };
  message?: string | null;
};

const CreateOrUpdateStudentSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, "Customer name is required"),
  age: z.coerce
    .number()
    .gt(5, { message: "Age must be greater than 5." })
    .lt(30, { message: "Age must be less than 30." }),
  guardianName: z.string().min(1, "Parent name is required"),
  guardianContact: z.string().min(1, "Parent contact is required"),
  assignedClasses: z
    .array(z.string())
    .min(1, "At least one class must be selected"),
});

export async function createOrUpdateStudent(_prevState: State, formData: FormData) {
  const validatedFields = CreateOrUpdateStudentSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    age: formData.get("age"),
    guardianName: formData.get("guardianName"),
    guardianContact: formData.get("guardianContact"),
    assignedClasses: formData.getAll("assignedClasses"),
  });
  
  if (!validatedFields.success) {
      console.log('formData:', formData.getAll('assignedClasses'));
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to add student.",
    };
  }

  try {
    createOrUpdateStudentWithClasses(validatedFields.data);
  } catch (e) {
    console.error(e);
    return {
      message: "Database Error: failed to add student",
    };
  }

  revalidatePath("/students");
  redirect("/students");
}