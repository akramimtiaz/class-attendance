"use server";
import z from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createOrUpdateStudentWithClasses } from "@/db/actions/students";
import { createOrUpdateTeacher as createOrUpdateTeacherInDb} from '@/db/actions/users';

export type StudentFormState = {
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

export async function createOrUpdateStudent(_prevState: StudentFormState, formData: FormData) {
  const validatedFields = CreateOrUpdateStudentSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    age: formData.get("age"),
    guardianName: formData.get("guardianName"),
    guardianContact: formData.get("guardianContact"),
    assignedClasses: formData.getAll("assignedClasses"),
  });
  
  if (!validatedFields.success) {
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

export type TeacherFormState = {
  errors?: {
    id?: string[];
    name?: string[];
    email?: string[];
    phoneNumber?: string[];
  };
  message?: string | null;
};

const CreateOrUpdateTeacherSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.email({ message: 'Email is required' }),
  phoneNumber: z.string().min(1, "Phone number is required"),
});

export async function createOrUpdateTeacher(
  _prevState: TeacherFormState,
  formData: FormData
) {
  const validatedFields = CreateOrUpdateTeacherSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to save teacher.",
    };
  }

  try {
    await createOrUpdateTeacherInDb(validatedFields.data);
  } catch (e) {
    console.error(e);
    return {
      message: "Database Error: Failed to save teacher.",
    };
  }

  revalidatePath("/teachers");
  redirect("/teachers");
}


