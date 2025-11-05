import postgres from 'postgres';

const sql = postgres(import.meta.env.VITE_DATABASE_URL, {
  ssl: 'require'
});

export default sql;
