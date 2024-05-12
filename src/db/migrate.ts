import '@/lib/config'

import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from '@/db';

(async () => {
    try {
        await migrate(db, './src/db/drizzle');
        console.log('Migration successful');

        process.exit(0);
    } catch (e) {
        console.error(e);

        process.exit(1);
    }
})();
