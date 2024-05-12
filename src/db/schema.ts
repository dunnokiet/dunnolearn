import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const courses = pgTable('courses', {
    id: serial('id').primaryKey(),
    tilte: text('name').notNull(),
    email: text('email').notNull().unique(),
    role: text('role', { enum: ['admin', 'user'] }).notNull()
});

export const insertCourseSchema = createInsertSchema(courses);
export const selectCourseSchema = createSelectSchema(courses);