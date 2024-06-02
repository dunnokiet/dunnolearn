import '@/lib/config'
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/db/schema.ts",
    out: "./src/db/drizzle",
    dbCredentials: {
        url: process.env.POSTGRES_URL!
    },
    schemaFilter: ["public"],
});