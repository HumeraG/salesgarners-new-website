import mysql from 'mysql2/promise';

// One shared pool across hot reloads in dev
const g = globalThis;
export function getPool() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
  if (!g.__sgPool) g.__sgPool = mysql.createPool({ uri: process.env.DATABASE_URL, connectionLimit: 10, dateStrings: false });
  return g.__sgPool;
}

export async function query(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}
