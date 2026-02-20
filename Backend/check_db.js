import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function checkColumns() {
    try {
        const res = await pool.query(`
      SELECT table_schema, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Item'
      ORDER BY table_schema, ordinal_position;
    `);
        console.log('Columns in Item table:');
        res.rows.forEach(row => console.log(`- [${row.table_schema}] ${row.column_name}: ${row.data_type}`));
        await pool.end();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkColumns();
