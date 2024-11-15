import { createClient } from '@libsql/client';

let db: ReturnType<typeof createClient>;

export function getDb() {
  if (!db) {
    db = createClient({
      url: 'file:local.db',
    });
  }
  return db;
}

export async function setupDb() {
  const client = getDb();
  
  // Create tenants table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS tenants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create users table with tenant reference
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      tenant_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    )
  `);

  // Add initial admin if it doesn't exist
  await client.execute({
    sql: `INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, 'siteAdmin')`,
    args: ['admin@gmail.com', 'password']
  });
}

export async function findUserByEmail(email: string) {
  const client = getDb();
  const result = await client.execute({
    sql: `
      SELECT users.*, tenants.name as tenant
      FROM users
      LEFT JOIN tenants ON users.tenant_id = tenants.id
      WHERE users.email = ?
    `,
    args: [email]
  });
  
  return result.rows[0];
}

export async function getAllTenants() {
  const client = getDb();
  const result = await client.execute(`
    SELECT 
      tenants.id,
      tenants.name as tenant,
      COUNT(users.id) as userCount
    FROM tenants
    LEFT JOIN users ON tenants.id = users.tenant_id AND users.role = 'user'
    WHERE tenants.name != 'Admin'
    GROUP BY tenants.id, tenants.name
  `);
  
  return result.rows;
}

export async function getTenantUsers(tenantId: number) {
  if (!tenantId) {
    throw new Error('Tenant ID is required');
  }

  const client = getDb();
  const result = await client.execute({
    sql: `
      SELECT id, email, role, created_at
      FROM users
      WHERE tenant_id = ? AND role = 'user'
    `,
    args: [tenantId]
  });
  
  return result.rows;
}

export async function getTenantAdmins(tenantId: number) {
  if (!tenantId) {
    throw new Error('Tenant ID is required');
  }

  const client = getDb();
  const result = await client.execute({
    sql: `
      SELECT id, email, created_at
      FROM users
      WHERE tenant_id = ? AND role = 'tenantAdmin'
    `,
    args: [tenantId]
  });
  
  return result.rows;
}

export async function createTenant(email: string, password: string, tenantName: string) {
  const client = getDb();
  
  try {
    await client.execute('BEGIN TRANSACTION');

    // Create the tenant
    const tenantResult = await client.execute({
      sql: `INSERT INTO tenants (name) VALUES (?) RETURNING id`,
      args: [tenantName]
    });
    
    const tenantId = tenantResult.rows[0]?.id;

    if (!tenantId) {
      throw new Error('Failed to create tenant');
    }

    // Create the tenant admin user
    await client.execute({
      sql: `INSERT INTO users (email, password, role, tenant_id) VALUES (?, ?, 'tenantAdmin', ?)`,
      args: [email, password, tenantId]
    });

    await client.execute('COMMIT');
  } catch (error) {
    await client.execute('ROLLBACK');
    throw error;
  }
}

export async function addTenantAdmin(email: string, password: string, tenantId: number) {
  if (!tenantId) {
    throw new Error('Tenant ID is required');
  }

  const client = getDb();
  
  try {
    await client.execute('BEGIN TRANSACTION');

    // Check if email already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Add the tenant admin
    await client.execute({
      sql: `INSERT INTO users (email, password, role, tenant_id) VALUES (?, ?, 'tenantAdmin', ?)`,
      args: [email, password, tenantId]
    });

    await client.execute('COMMIT');
  } catch (error) {
    await client.execute('ROLLBACK');
    throw error;
  }
}

export async function addUserToTenant(email: string, password: string, tenantId: number) {
  if (!tenantId) {
    throw new Error('Tenant ID is required');
  }

  const client = getDb();
  
  try {
    await client.execute('BEGIN TRANSACTION');

    // Check if email already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Add the user
    await client.execute({
      sql: `INSERT INTO users (email, password, role, tenant_id) VALUES (?, ?, 'user', ?)`,
      args: [email, password, tenantId]
    });

    await client.execute('COMMIT');
  } catch (error) {
    await client.execute('ROLLBACK');
    throw error;
  }
}

function handleDbError(error: unknown, message: string) {
  console.error(message, error);
  throw new Error(message);
}