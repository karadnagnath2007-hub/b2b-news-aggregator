import { NextRequest } from 'next/server';
import { prisma } from './prisma';
import type { User } from '@prisma/client';

export async function getUserFromRequest(request: NextRequest): Promise<User | null> {
  const email = request.headers.get('x-user-email')?.trim();
  if (!email) {
    return null;
  }
  return prisma.user.findUnique({
    where: { email },
  });
}

export function assertPremiumUser(user: User | null) {
  if (!user) {
    const error = new Error('Authentication required for premium access.');
    (error as any).status = 401;
    throw error;
  }

  if (!user.isPremium) {
    const error = new Error('Premium access required for deep-dive data.');
    (error as any).status = 403;
    throw error;
  }

  return user;
}
