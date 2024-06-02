import { integer, pgTable, pgSchema, serial, varchar, text, timestamp, uuid, boolean, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const authSchema = pgSchema('auth');

export const users = authSchema.table('users', {
    id: uuid('id').primaryKey(),
    email: varchar('email'),
});

export const courses = pgTable('courses', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('userId').references(() => users.id),
    title: text('title'),
    description: text('description'),
    imageURL: text('imageURL'),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),

    categoryId: uuid('categoryId').references(() => categories.id)
});

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

    courseId: uuid('courseId').references(() => courses.id),
});

export const modules = pgTable('modules', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title'),
    description: text('description'),
    videoURL: text('videoURL'),
    position: integer('position'),

    courseId: uuid('courseId').references(() => courses.id, { onDelete: 'cascade' }),
})

export const videos = pgTable('videos', {
    id: uuid('id').primaryKey().defaultRandom(),
    assetId: text('assetId'),
    playbackId: text('playbackId'),

    moduleId: uuid('moduleId').references(() => modules.id),
})

export const users_lesson = pgTable('users_lesson', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('userId').unique(),
    videoId: uuid('videoId').unique().references(() => videos.id),

    isCompleted: boolean('isCompleted').default(false),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
})

export const usersRelations = relations(courses, ({ many }) => ({
    courses: many(courses),
}));

export const couresRelations = relations(courses, ({ one, many }) => ({
    attachments: many(attachments),
    modules: many(modules),

    users: one(users, {
        fields: [courses.userId],
        references: [users.id],
    }),
    categories: one(categories, {
        fields: [courses.categoryId],
        references: [categories.id],
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
    videos: many(videos),

    courses: one(courses, {
        fields: [modules.courseId],
        references: [courses.id],
    }),
}));

export const videosRelations = relations(videos, ({ one }) => ({
    modules: one(modules, {
        fields: [videos.moduleId],
        references: [modules.id],
    }),
}));


export type SelectCourse = typeof courses.$inferSelect;
export type SelectCategory = typeof categories.$inferSelect;


// // This is your Prisma schema file,
// // learn more about it in the docs: https://pris.ly/d/prisma-schema

// generator client {
//   provider = "prisma-client-js"
// }

// datasource db {
//   provider = "postgresql"
//   url      = env("DATABASE_URL")
//   directUrl = env("DIRECT_URL")
//   relationMode = "prisma"
// }

// model Course {
//   id        String @id @default(uuid())
//   userId    String
//   title     String @db.Text
//   description String? @db.Text
//   imageUrl String? @db.Text
//   price Float?
//   isPublished Boolean @default(false)

//   categoryId String?
//   category Category? @relation(fields: [categoryId], references: [id])

//   chapters Chapter[]
//   attachments Attachment[]
//   purchases Purchase[]

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   @@index([categoryId])
// }

// model Category {
//   id        String @id @default(uuid())
//   name      String @unique
//   courses Course[]
// }

// model Attachment {
//   id        String @id @default(uuid())
//   name      String 
//   url       String @db.Text

//   courseId  String
//   course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   @@index([courseId])
// }

// model Chapter{
//   id        String @id @default(uuid())
//   title     String 
//   description String? @db.Text
//   videoUrl String? @db.Text
//   position Int
//   isPublished Boolean @default(false)
//   isFree Boolean @default(false)

//   muxData MuxData?

//   courseId  String
//   course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)

//   userProgress UserProgress[]

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   @@index([courseId])
// }

// model MuxData {
//   id        String @id @default(uuid())
//   assetId String
//   playbackId String?

//   chapterId String @unique
//   chapter Chapter @relation(fields: [chapterId], references: [id], onDelete: Cascade) 
// }

// model UserProgress {
//   id        String @id @default(uuid())
//   userId    String

//   chapterId String
//   chapter Chapter @relation(fields: [chapterId], references: [id], onDelete: Cascade)

//   isCompleted Boolean @default(false)

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   @@index([chapterId])
//   @@unique([userId, chapterId])
// }