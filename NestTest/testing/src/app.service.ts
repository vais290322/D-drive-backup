import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { apiResponse } from './common/api-response';

@Injectable()
export class AppService {

  constructor(
    @Inject('PG_CONNECTION') private readonly pool: Pool,
  ) {}

  getHello(): string {
    return 'nest server is running on port 3000';
  }

  async testConnection() {
    try {
      const result = await this.pool.query('SELECT NOW()');
      console.log('DB Connected:', result.rows);
      return result.rows;
    } catch (error) {
      console.error('DB Connection Failed:', error.message);
      throw error;
    }
  }


  async getAllTables() {
  const result = await this.pool.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);

  return result.rows;
}

async getAllTablesWithSize() {
  const result = await this.pool.query(`
    SELECT
      relname AS table_name,
      n_live_tup AS row_count,
      pg_size_pretty(pg_total_relation_size(relid)) AS total_size
    FROM pg_stat_user_tables
    ORDER BY pg_total_relation_size(relid) DESC;
  `);

    return apiResponse(
    true,
    200,
    'Tables fetched successfully',
    result.rows,
  );
}




}