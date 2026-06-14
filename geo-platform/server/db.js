const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'geo_platform',
  max: 20
});
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});
module.exports = pool;