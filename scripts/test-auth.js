const crypto = require('crypto');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_5CGUoVg0xPBu@ep-floral-dew-b98j9jsw-pooler.c-7.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

async function testAuth() {
  const users = await pool.query('SELECT id, name, username, "passwordHash", pin, role, "isActive" FROM "User"');
  console.log('Seeded Users in DB:');
  for (const u of users.rows) {
    console.log(` - ${u.username} (${u.role}): name="${u.name}", pin=${u.pin}, isActive=${u.isActive}`);
  }
  
  // Test maestro
  const mRes = await pool.query('SELECT * FROM "User" WHERE username=$1 AND "passwordHash"=$2', ['maestro', sha256('123456789')]);
  console.log('Maestro login test:', mRes.rows.length === 1 ? 'PASS ✅' : 'FAIL ❌');
  
  // Test cashier
  const cRes = await pool.query('SELECT * FROM "User" WHERE username=$1 AND "passwordHash"=$2', ['captain_cashier', sha256('123456')]);
  console.log('Cashier demo login test:', cRes.rows.length === 1 ? 'PASS ✅' : 'FAIL ❌');

  // Test manager
  const mgrRes = await pool.query('SELECT * FROM "User" WHERE username=$1 AND "passwordHash"=$2', ['captain_manager', sha256('123456')]);
  console.log('Manager demo login test:', mgrRes.rows.length === 1 ? 'PASS ✅' : 'FAIL ❌');
  
  pool.end();
}

testAuth().catch(err => {
  console.error('Error:', err);
  pool.end();
});
