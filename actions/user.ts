'use server'

import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
import { UserType } from '@/types/userType';

const API_URL = process.env.API_URL || 'http://localhost:8000';

async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
}

export async function getMyInfo(): Promise<UserType | null> {
  const token = await getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/api/identities/users/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      next: { tags: ['user-profile'] },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return (data?.data as UserType) || null;
  } catch {
    return null;
  }
}

export async function updateProfile(
  userId: number,
  formData: FormData
): Promise<{ success?: true; user?: UserType; error?: string }> {
  const token = await getToken();
  if (!token) return { error: 'لطفا وارد شوید' };

  try {
    const res = await fetch(`${API_URL}/api/identities/users/${userId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'X-HTTP-Method-Override': 'PUT',
      },
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data?.message || 'خطا در بروزرسانی اطلاعات' };
    }

    const data = await res.json();
    revalidateTag('user-profile');
    return { success: true, user: data?.data as UserType };
  } catch {
    return { error: 'خطا در اتصال به سرور' };
  }
}
