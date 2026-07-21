import { Pool } from 'pg';

export const databaseProvider = {
    provide: 'PG_CONNECTION',
    useFactory: async () => {
        const pool = new Pool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });

        return pool;
    },
};