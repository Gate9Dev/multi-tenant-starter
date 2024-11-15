import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('database.sqlite');

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    tenant TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Add some test users
const insertUser = db.prepare(`
  INSERT OR REPLACE INTO users (email, password, tenant)
  VALUES (?, ?, ?)
`);

// Create test users with hashed passwords
const users = [
  { email: 'a@gmail.com', password: 'password', tenant: 'gmail.com' },
  { email: 'b@outlook.com', password: 'password', tenant: 'outlook.com' },
];

for (const user of users) {
  const hashedPassword = bcrypt.hashSync(user.password, 10);
  insertUser.run(user.email, hashedPassword, user.tenant);
}

console.log('Database setup completed!');