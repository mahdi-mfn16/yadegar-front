'use server'

import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
import { FamilyMemberType } from '@/types/familyType';

const API_URL = process.env.API_URL || 'http://localhost:8000';

async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
}

// ⚠ backend route باید از PUT به GET تغییر کنه
export async function getFamilyMembers(): Promise<FamilyMemberType[]> {
  const token = await getToken();
  if (!token) return [];
  try {
    const res = await fetch(`${API_URL}/api/identities/families/list`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      next: { tags: ['family-members'] },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const raw = data?.data?.items;
    const list = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
    return list as FamilyMemberType[];
  } catch {
    return [];
  }
}

export async function inviteToFamily(
  mobile: string,
  name?: string
): Promise<{ success?: true; error?: string }> {
  const token = await getToken();
  if (!token) return { error: 'لطفا وارد شوید' };
  try {
    const body: Record<string, string> = { mobile };
    if (name) body.name = name;

    const res = await fetch(`${API_URL}/api/identities/families/invite`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data?.message || 'خطا در ارسال دعوتنامه' };
    }
    revalidateTag('family-members', {expire: 300});
    return { success: true };
  } catch {
    return { error: 'خطا در اتصال به سرور' };
  }
}

export async function updateFamilyMemberName(
  familyId: number,
  name: string
): Promise<{ success?: true; error?: string }> {
  const token = await getToken();
  if (!token) return { error: 'لطفا وارد شوید' };
  try {
    const res = await fetch(`${API_URL}/api/identities/families/${familyId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data?.message || 'خطا در ویرایش نام' };
    }
    revalidateTag('family-members', {expire: 300});
    return { success: true };
  } catch {
    return { error: 'خطا در اتصال به سرور' };
  }
}

// ⚠ member_id باید از FamilyResource برگردانده بشه (backend fix)
export async function removeFromFamily(
  memberId: number
): Promise<{ success?: true; error?: string }> {
  const token = await getToken();
  if (!token) return { error: 'لطفا وارد شوید' };
  try {
    const res = await fetch(`${API_URL}/api/identities/families/remove`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ member_id: memberId }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data?.message || 'خطا در حذف عضو' };
    }
    revalidateTag('family-members', {expire: 300});
    return { success: true };
  } catch {
    return { error: 'خطا در اتصال به سرور' };
  }
}

export async function joinToFamily(
  text: string
): Promise<{ success?: true; error?: string }> {
  const token = await getToken();
  if (!token) return { error: 'ابتدا وارد شوید' };
  try {
    const res = await fetch(`${API_URL}/api/identities/families/join`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data?.message || 'لینک دعوت معتبر نیست' };
    }
    revalidateTag('family-members', {expire: 300});
    revalidateTag('friends-memories', {expire: 300});
    revalidateTag('explore-memories', {expire: 300});
    return { success: true };
  } catch {
    return { error: 'خطا در اتصال به سرور' };
  }
}
