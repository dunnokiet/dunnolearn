import { integer, pgTable, primaryKey, foreignKey, pgSchema, serial, varchar, text, timestamp, uuid, boolean, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

const authSchema = pgSchema('auth');

export const users = authSchema.table('users', {
    id: uuid('id').primaryKey(),
    email: varchar('email'),
});

export const courses = pgTable('courses', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('userId').references(() => users.id, { onDelete: 'cascade' }),
    title: text('title'),
    description: text('description'),
    imageURL: text('imageURL'),
    isPublished: boolean('isPublished').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
    categoryId: uuid('categoryId').references(() => categories.id)
});

export const lecturers = pgTable('lecturers', {
    id: uuid('id').primaryKey().defaultRandom(),
    fullName: text("fullName"),
});

export const instructors = pgTable('instructors', {
    courseId: uuid('courseId').references(() => courses.id),
    lecturerId: uuid('lecturerId').references(() => lecturers.id),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.courseId, table.lecturerId] }),
    }
})

export const enrolments = pgTable('enrolments', {
    userId: uuid('userId').references(() => users.id, { onDelete: 'cascade' }),
    courseId: uuid('courseId').references(() => courses.id, { onDelete: 'cascade' }),
    enrolment_date: timestamp('enrolment_date').defaultNow(),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.userId, table.courseId] }),
    }
})

export const categories = pgTable('categories', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').unique(),
});

export const attachments = pgTable('attachments', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').unique(),
    URL: text('URL'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
    courseId: uuid('courseId').references(() => courses.id, { onDelete: 'cascade' }),
});

export const modules = pgTable('modules', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title'),
    description: text('description'),
    order: integer('order'),
    isPublished: boolean('isPublished').default(false),
    courseId: uuid('courseId').references(() => courses.id, { onDelete: 'cascade' }),
})

export const lessons = pgTable('lessons', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title'),
    description: text('description'),
    videoURL: text('videoURL'),
    order: integer('order'),
    isPublished: boolean('isPublished').default(false),
    moduleId: uuid('moduleId').references(() => modules.id, { onDelete: 'cascade' }),
})

export const users_progress = pgTable('users_progress', {
    userId: uuid('userId').references(() => users.id),
    lessonId: uuid('lessonId').references(() => lessons.id),
    isCompleted: boolean('isCompleted').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.userId, table.lessonId] }),
    }
})

export const usersRelations = relations(users, ({ many }) => ({
    courses: many(courses),
    enrolments: many(enrolments),
    users_progress: many(users_progress),
}));

export const couresRelations = relations(courses, ({ one, many }) => ({
    attachments: many(attachments),
    modules: many(modules),
    enrolments: many(enrolments),

    users: one(users, {
        fields: [courses.userId],
        references: [users.id],
    }),
    categories: one(categories, {
        fields: [courses.categoryId],
        references: [categories.id],
    }),
}));

export const enrolmentsRelations = relations(enrolments, ({ one }) => ({
    users: one(users, {
        fields: [enrolments.userId],
        references: [users.id],
    }),
    courses: one(courses, {
        fields: [enrolments.courseId],
        references: [courses.id],
    }),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
    courses: one(courses, {
        fields: [attachments.courseId],
        references: [courses.id],
    }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
    courses: many(courses),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
    lessons: many(lessons),
    courses: one(courses, {
        fields: [modules.courseId],
        references: [courses.id],
    }),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
    users_progress: many(users_progress),
    modules: one(modules, {
        fields: [lessons.moduleId],
        references: [modules.id],
    }),
}));

export const usersProgressRelations = relations(users_progress, ({ one }) => ({
    users: one(users, {
        fields: [users_progress.userId],
        references: [users.id],
    }),
    lessons: one(lessons, {
        fields: [users_progress.lessonId],
        references: [lessons.id],
    }),
}));

export type SelectCourse = typeof courses.$inferSelect;
export type SelectCategory = typeof categories.$inferSelect;
export type SelectModule = typeof modules.$inferSelect;
export type SelectLesson = typeof lessons.$inferSelect;
export type SelectAttachment = typeof attachments.$inferSelect;