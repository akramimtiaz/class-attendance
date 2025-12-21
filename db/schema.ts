import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const userRoleEnum = pgEnum("user_role", ["admin", "teacher"]);
export const dayOfWeekEnum = pgEnum("day_of_week", [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]);

// Tables
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  role: userRoleEnum("role").notNull(),
  phoneNumber: text("phone_number"),
  isActive: boolean("is_active").default(true).notNull(),
  isDeleted: boolean("is_deleted").default(false),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const students = pgTable("students", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  guardianName: text("guardian_name"),
  guardianContact: text("guardian_contact"),
  isActive: boolean("is_active").default(true).notNull(),
  isDeleted: boolean("is_deleted").default(false),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const classes = pgTable("classes", {
  id: uuid("id").defaultRandom().primaryKey(),
  className: text("class_name").notNull(),
  dayOfWeek: dayOfWeekEnum("day_of_week").notNull(),
  assignedTeacherId: uuid("assigned_teacher_id").notNull().references(() => users.id),
  isActive: boolean("is_active").default(true).notNull(),
  isDeleted: boolean("is_deleted").default(false),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const classStudents = pgTable("class_students", {
  id: uuid("id").defaultRandom().primaryKey(),
  classId: uuid("class_id")
    .notNull()
    .references(() => classes.id, { onDelete: "cascade" }),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  enrolledAt: timestamp("enrolled_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const classSessions = pgTable("class_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  classId: uuid("class_id")
    .notNull()
    .references(() => classes.id, { onDelete: "cascade" }),
  teacherId: uuid("teacher_id").notNull().references(() => users.id),
  sessionDate: date("session_date").notNull(),
  cancelled: boolean("cancelled").default(false).notNull(),
  cancelReason: text("cancel_reason"),
  markedByUserId: uuid("marked_by_user_id")
    .references(() => users.id),
  markedAt: timestamp("marked_at", { withTimezone: true }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const studentAttendance = pgTable("student_attendance", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => classSessions.id, { onDelete: "cascade" }),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  attended: boolean("attended").default(true),
  markedByUserId: uuid("marked_by_user_id")
    .notNull()
    .references(() => users.id),
  markedAt: timestamp("marked_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  classesAssigned: many(classes),
  classSessionsAsTeacher: many(classSessions, {
    relationName: "teacher",
  }),
  classSessionsMarked: many(classSessions, {
    relationName: "sessionMarker",
  }),
  classSessionsCreated: many(classSessions, {
    relationName: "sessionCreator",
  }),
  attendanceMarked: many(studentAttendance),
}));

export const studentsRelations = relations(students, ({ many }) => ({
  classStudents: many(classStudents),
  attendance: many(studentAttendance),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  assignedTeacher: one(users, {
    fields: [classes.assignedTeacherId],
    references: [users.id],
  }),
  classStudents: many(classStudents),
  classSessions: many(classSessions),
}));

export const classStudentsRelations = relations(classStudents, ({ one }) => ({
  class: one(classes, {
    fields: [classStudents.classId],
    references: [classes.id],
  }),
  student: one(students, {
    fields: [classStudents.studentId],
    references: [students.id],
  }),
}));

export const classSessionsRelations = relations(classSessions, ({ one, many }) => ({
  class: one(classes, {
    fields: [classSessions.classId],
    references: [classes.id],
  }),
  teacher: one(users, {
    fields: [classSessions.teacherId],
    references: [users.id],
    relationName: "teacher",
  }),
  markedBy: one(users, {
    fields: [classSessions.markedByUserId],
    references: [users.id],
    relationName: "sessionMarker",
  }),
  createdBy: one(users, {
    fields: [classSessions.createdBy],
    references: [users.id],
    relationName: "sessionCreator",
  }),
  attendance: many(studentAttendance),
}));

export const studentAttendanceRelations = relations(studentAttendance, ({ one }) => ({
  session: one(classSessions, {
    fields: [studentAttendance.sessionId],
    references: [classSessions.id],
  }),
  student: one(students, {
    fields: [studentAttendance.studentId],
    references: [students.id],
  }),
  markedBy: one(users, {
    fields: [studentAttendance.markedByUserId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;

export type Class = typeof classes.$inferSelect;
export type NewClass = typeof classes.$inferInsert;

export type ClassStudent = typeof classStudents.$inferSelect;
export type NewClassStudent = typeof classStudents.$inferInsert;

export type ClassSession = typeof classSessions.$inferSelect;
export type NewClassSession = typeof classSessions.$inferInsert;

export type StudentAttendance = typeof studentAttendance.$inferSelect;
export type NewStudentAttendance = typeof studentAttendance.$inferInsert;

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);