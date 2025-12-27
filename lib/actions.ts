"use server";
import z from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createOrUpdateStudentWithClasses } from "@/db/actions/students";
import { createOrUpdateTeacher as createOrUpdateTeacherInDb} from '@/db/actions/users';
import { createOrUpdateClass as createOrUpdateClassInDb } from '@/db/actions/classes';
import { createClassSession as createClassSessionInDb } from '@/db/actions/class-sessions';
import { dayOfWeekEnum } from '@/db/schema';
import day from 'dayjs';

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

export type ClassFormState = {
  errors?: {
    className?: string[];
    dayOfWeek?: string[];
    assignedTeacherId?: string[];
  };
  message?: string | null;
};

const CreateOrUpdateClassSchema = z.object({
  id: z.string().optional(),
  className: z.string().min(1, "Class name is required"),
  dayOfWeek: z.enum(dayOfWeekEnum.enumValues, {
    message: "Please select a valid day of the week",
  }),
  assignedTeacherId: z.string().min(1, "Please select a teacher"),
});

export async function createOrUpdateClass(
  _prevState: ClassFormState,
  formData: FormData
) {
  const validatedFields = CreateOrUpdateClassSchema.safeParse({
    id: formData.get("id") || undefined,
    className: formData.get("className"),
    dayOfWeek: formData.get("dayOfWeek"),
    assignedTeacherId: formData.get("assignedTeacherId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to save class.",
    };
  }

  try {
    await createOrUpdateClassInDb(validatedFields.data);
  } catch (e) {
    console.error(e);
    return {
      message: "Database Error: Failed to save class.",
    };
  }

  revalidatePath("/classes");
  redirect("/classes");
}

export type ClassSessionFormState = {
  errors?: {
    classId?: string[];
    teacherId?: string[];
    sessionDate?: string[];
  };
  message?: string | null;
};

const CreateClassSessionSchema = z.object({
  classId: z.string().min(1, "Class ID is required"),
  teacherId: z.string().min(1, "Please select a teacher"),
  sessionDate: z
    .string()
    .min(1, "Session date is required")
    .refine((date) => {
      const selectedDate = day(date);
      const today = day().startOf("day");
      return selectedDate.isAfter(today) || selectedDate.isSame(today, "day");
    }, {
      message: "Session date cannot be in the past",
    }),
});

export async function createClassSession(
  _prevState: ClassSessionFormState,
  formData: FormData
) {
  const validatedFields = CreateClassSessionSchema.safeParse({
    classId: formData.get("classId"),
    teacherId: formData.get("teacherId"),
    sessionDate: formData.get("sessionDate"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to create session.",
    };
  }

  try {
    // TODO: Get the actual user ID from session/auth
    await createClassSessionInDb({
      ...validatedFields.data,
      createdBy: validatedFields.data.teacherId, // Placeholder user ID
    });
  } catch (e) {
    console.error(e);
    return {
      message: "Database Error: Failed to create session.",
    };
  }

  revalidatePath("/classes");
  redirect("/classes");
}


