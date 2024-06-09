import { attachments, categories, courses } from "@/db/schema"
import '@/lib/config'
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import postgres from 'postgres';

const client = postgres(process.env.POSTGRES_URL!);
export const db = drizzle(client, { schema });

async function main() {
    try {
        console.log("Seeding database");

        await db.delete(categories);

        await db.insert(categories).values(
            [
                { name: "Web Development" },
                { name: "Machine Learning" },
                { name: "Databases" },
                { name: "Software Architecture" },
            ]
        )

        console.log("Success");
    } catch (error) {
        console.log("Error seeding the database categories", error);
    } finally {
        client.end();
    }
}

main();