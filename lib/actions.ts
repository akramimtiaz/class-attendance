"use server";
import z from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createOrUpdateStudentWithClasses } from "@/db/actions/students";
import { createOrUpdateTeacher as createOrUpdateTeacherInDb} from '@/db/actions/users';
import { createOrUpdateClass as createOrUpdateClassInDb } from '@/db/actions/classes';
import { createClassSession as createClassSessionInDb, updateClassSession as updateClassSessionInDb, deleteClassSession as deleteClassSessionInDb, cancelClassSession as cancelClassSessionInDb } from '@/db/actions/class-sessions';
import { createStudentAttendanceRecords } from '@/db/actions/student-attendance';
import { dayOfWeekEnum } from '@/db/schema';
import day from 'dayjs';
import { getCurrentUser } from '@/lib/dal';

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
  const user = await getCurrentUser();
  
  if (!user) {
    return {
      message: "Unauthorized: You must be logged in to create a session.",
    };
  }

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
    // Check for duplicate session (same class + same date)
    const { db } = await import("@/db/drizzle");
    const { classSessions } = await import("@/db/schema");
    const { eq, and } = await import("drizzle-orm");
    
    const existingSession = await db.query.classSessions.findFirst({
      where: and(
        eq(classSessions.classId, validatedFields.data.classId),
        eq(classSessions.sessionDate, validatedFields.data.sessionDate)
      ),
    });

    if (existingSession) {
      return {
        message: "A session for this class on this date already exists.",
        errors: {},
      };
    }

    await createClassSessionInDb({
      ...validatedFields.data,
      createdBy: user.id,
    });
  } catch (e) {
    console.error(e);
    return {
      message: "Database Error: Failed to create session.",
    };
  }

  // Redirect based on user role
  if (user.role === "teacher") {
    revalidatePath("/sessions");
    redirect("/sessions");
  } else {
    revalidatePath("/classes");
    redirect("/classes");
  }
}

export type UpdateSessionFormState = {
  errors?: {
    id?: string[];
    teacherId?: string[];
    sessionDate?: string[];
  };
  message?: string | null;
};

const UpdateClassSessionSchema = z.object({
  id: z.string().min(1, "Session ID is required"),
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

export async function updateClassSession(
  _prevState: UpdateSessionFormState,
  formData: FormData
) {
  const validatedFields = UpdateClassSessionSchema.safeParse({
    id: formData.get("id"),
    teacherId: formData.get("teacherId"),
    sessionDate: formData.get("sessionDate"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to update session.",
    };
  }

  try {
    await updateClassSessionInDb(validatedFields.data);
  } catch (e) {
    console.error(e);
    return {
      message: "Database Error: Failed to update session.",
    };
  }

  revalidatePath("/classes");
  redirect("/classes");
}

export type DeleteSessionFormState = {
  message?: string | null;
};

export async function deleteClassSession(
  _prevState: DeleteSessionFormState,
  formData: FormData
) {
  const sessionId = formData.get("sessionId") as string;

  if (!sessionId) {
    return {
      message: "Session ID is required.",
    };
  }

  try {
    await deleteClassSessionInDb(sessionId);
  } catch (e) {
    console.error(e);
    return {
      message: "Database Error: Failed to delete session.",
    };
  }

  revalidatePath("/classes");
  redirect("/classes");
}

export type CancelSessionFormState = {
  errors?: {
    sessionId?: string[];
    cancelReason?: string[];
  };
  message?: string | null;
};

const CancelClassSessionSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  cancelReason: z
    .string()
    .min(10, "Cancellation reason is required")
    .max(300, "Cancellation reason must be 300 characters or less"),
});

export async function cancelClassSession(
  _prevState: CancelSessionFormState,
  formData: FormData
) {
  const user = await getCurrentUser();
  if (!user) {
    return {
      message: "Unauthorized: You must be logged in to create a session.",
    };
  }

  const validatedFields = CancelClassSessionSchema.safeParse({
    sessionId: formData.get("sessionId"),
    cancelReason: formData.get("cancelReason"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to cancel session.",
    };
  }

  try {
    await cancelClassSessionInDb({
      sessionId: validatedFields.data.sessionId,
      cancelReason: validatedFields.data.cancelReason,
      markedByUserId: user.id,
    });
  } catch (e) {
    console.error(e);
    return {
      message: "Database Error: Failed to cancel session.",
    };
  }

  revalidatePath("/classes");
  redirect("/classes");
}

export type AttendanceFormState = {
  errors?: {
    sessionId?: string[];
    attendance?: string[];
  };
  message?: string | null;
};

const MarkAttendanceSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  attendance: z
    .array(
      z.object({
        studentId: z.string().min(1, "Student ID is required"),
        attended: z.boolean(),
      })
    )
    .min(1, "At least one student must be marked"),
});

export async function markAttendance(
  _prevState: AttendanceFormState,
  formData: FormData
) {
  // Get the current authenticated user
  const user = await getCurrentUser();
  
  if (!user) {
    return {
      message: "Unauthorized: You must be logged in to mark attendance.",
    };
  }

  // Parse attendance data from form
  const studentIds = formData.getAll("studentId") as string[];
  const attendanceData = studentIds.map((studentId) => ({
    studentId,
    attended: formData.get(`attendance-${studentId}`) === "true",
  }));

  const validatedFields = MarkAttendanceSchema.safeParse({
    sessionId: formData.get("sessionId"),
    attendance: attendanceData,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to mark attendance.",
    };
  }

  try {
    await createStudentAttendanceRecords({
      sessionId: validatedFields.data.sessionId,
      studentAttendance: validatedFields.data.attendance,
      markedByUserId: user.id,
    });
  } catch (e) {
    console.error(e);
    return {
      message: "Database Error: Failed to mark attendance.",
    };
  }

  revalidatePath("/classes");
  redirect("/classes");
}


