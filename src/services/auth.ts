import { findUserByEmail } from '../lib/db';

export interface User {
  id: number;
  email: string;
  tenant: string;
  role: string;
  tenant_id: number;
}

export async function authenticateUser(email: string, password: string): Promise<User> {
  const user = await findUserByEmail(email);
  
  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }

  return {
    id: user.id as number,
    email: user.email as string,
    tenant: user.tenant as string,
    role: user.role as string,
    tenant_id: user.tenant_id as number
  };
}