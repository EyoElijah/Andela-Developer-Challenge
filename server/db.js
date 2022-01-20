import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  user: process.env.dbuser,
  host: process.env.dbhost,
  database: process.env.dbdatabase,
  password: process.env.dbpassword,
  port: process.env.port,
});

export default pool;
