'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_URL = process.env.API_URL || 'http://localhost:8000';

export async function sendLoginCode(mobile: string): Promise<{ success?: true; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/identities/auth/login?mobile=${mobile}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data?.message || 'خطا در ارسال کد تایید' };
    }

    return { success: true };
  } catch {
    return { error: 'خطا در اتصال به سرور' };
  }
}

export async function resendCode(mobile: string): Promise<{ success?: true; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/identities/auth/send-code?mobile=${mobile}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data?.message || 'خطا در ارسال مجدد کد' };
    }

    return { success: true };
  } catch {
    return { error: 'خطا در اتصال به سرور' };
  }
}

export async function verifyCode(
  mobile: string,
  code: string
): Promise<{ success?: true; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/identities/auth/check-code`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobile, code }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data?.message || 'کد وارد شده معتبر نیست' };
    }

    const data = await res.json();
    const token: string | undefined = data?.data?.token;

    if (!token) {
      return { error: 'خطا در دریافت توکن' };
    }

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return { success: true };
  } catch {
    return { error: 'خطا در اتصال به سرور' };
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (token) {
    await fetch(`${API_URL}/api/identities/auth/logout`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }).catch(() => {});
  }

  cookieStore.delete('auth_token');
  redirect('/login');
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
}
