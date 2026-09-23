'use server';

import { createSession, destroySession, getCurrentUser, hashPassword, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const expectedRole = formData.get('expectedRole') as string;

  if (!email || !password) {
    return { error: 'Please provide both email and password.' };
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    return { error: 'Invalid email or password.' };
  }

  if (user.status !== 'ACTIVE') {
    return { error: 'This account has been deactivated. Please contact support.' };
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return { error: 'Invalid email or password.' };
  }

  if (expectedRole && user.role !== expectedRole) {
    if (expectedRole === 'ADMIN') {
      return { error: 'Access denied: This account does not have Admin privileges.' };
    }
    if (expectedRole === 'TOURIST' && user.role === 'ADMIN') {
      return { error: 'This is an Admin account. Please switch to the Admin category to sign in.' };
    }
  }

  await createSession(user.id);

  if (user.role === 'ADMIN') {
    redirect('/admin');
  } else {
    redirect('/dashboard');
  }
}

export async function registerAction(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = (formData.get('role') as string) || 'TOURIST';

  if (!name || !email || !password) {
    return { error: 'Please fill in all required fields.' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' };
  }

  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (existing) {
    return { error: 'An account with this email address already exists.' };
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role === 'BUSINESS' ? 'BUSINESS' : 'TOURIST',
      status: 'ACTIVE',
    },
  });

  await createSession(user.id);
  redirect('/dashboard');
}

export async function logoutAction() {
  await destroySession();
  revalidatePath('/');
  redirect('/');
}

export async function demoLoginAction(role: 'admin' | 'tourist' | 'business') {
  const emailMap = {
    admin: 'admin@bahirdar.travel',
    tourist: 'tourist@bahirdar.travel',
    business: 'business@bahirdar.travel',
  };

  const email = emailMap[role];
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    await createSession(user.id);
    if (user.role === 'ADMIN') {
      redirect('/admin');
    } else {
      redirect('/dashboard');
    }
  }
}

export async function updateProfileAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const name = formData.get('name') as string;
  const bio = formData.get('bio') as string;
  const avatar = formData.get('avatar') as string;
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;

  if (!name || name.trim().length === 0) {
    return { error: 'Full name cannot be empty.' };
  }

  const updateData: any = {
    name: name.trim(),
    bio: bio ? bio.trim() : null,
    avatar: avatar ? avatar.trim() : null,
  };

  if (newPassword && newPassword.trim().length > 0) {
    if (newPassword.length < 6) {
      return { error: 'New password must be at least 6 characters.' };
    }
    if (!currentPassword) {
      return { error: 'Please enter your current password to set a new password.' };
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      return { error: 'User not found.' };
    }

    const isValid = await verifyPassword(currentPassword, dbUser.password);
    if (!isValid) {
      return { error: 'Current password is incorrect.' };
    }

    updateData.password = await hashPassword(newPassword);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: updateData,
  });

  revalidatePath('/dashboard/profile');
  revalidatePath('/dashboard');
  revalidatePath('/');

  return { success: true };
}
