'use server'

import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
import type { FolderType, MemoryType, FolderFormData } from '@/types/memoryType';

const API_URL = process.env.API_URL || 'http://localhost:8000';

async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
}

// dynamicResponse structure:
//  list/collection → { error, message, data: { items: [...] } }
//  single item     → { error, message, data: { item: {...} } }

// ─── FOLDERS ──────────────────────────────────────────────

export async function getMyFolders(): Promise<FolderType[]> {
  const token = await getToken();
  if (!token) return [];
  try {
    const res = await fetch(`${API_URL}/api/memories/folders/myself`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      next: { tags: ['my-folders'] },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.data?.items as FolderType[]) || [];
  } catch {
    return [];
  }
}

export async function getFolder(id: number): Promise<FolderType | null> {
  const token = await getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_URL}/api/memories/folders/${id}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      next: { tags: [`folder-${id}`] },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data?.data?.item as FolderType) || null;
  } catch {
    return null;
  }
}

export async function createFolder(
  payload: FolderFormData
): Promise<{ success?: true; folder?: FolderType; error?: string }> {
  const token = await getToken();
  if (!token) return { error: 'لطفا وارد شوید' };
  try {
    const res = await fetch(`${API_URL}/api/memories/folders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data?.message || 'خطا در ایجاد آلبوم' };
    }
    const data = await res.json();
    revalidateTag('my-folders', {expire: 300});
    return { success: true, folder: data?.data?.item as FolderType };
  } catch {
    return { error: 'خطا در اتصال به سرور' };
  }
}

export async function updateFolder(
  id: number,
  payload: FolderFormData
): Promise<{ success?: true; error?: string }> {
  const token = await getToken();
  if (!token) return { error: 'لطفا وارد شوید' };
  try {
    const res = await fetch(`${API_URL}/api/memories/folders/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data?.message || 'خطا در ویرایش آلبوم' };
    }
    revalidateTag('my-folders', {expire: 300});
    revalidateTag(`folder-${id}`, {expire: 300});
    return { success: true };
  } catch {
    return { error: 'خطا در اتصال به سرور' };
  }
}

export async function deleteFolder(
  id: number
): Promise<{ success?: true; error?: string }> {
  const token = await getToken();
  if (!token) return { error: 'لطفا وارد شوید' };
  try {
    const res = await fetch(`${API_URL}/api/memories/folders/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data?.message || 'خطا در حذف آلبوم' };
    }
    revalidateTag('my-folders', {expire: 300});
    return { success: true };
  } catch {
    return { error: 'خطا در اتصال به سرور' };
  }
}

// ─── MEMORIES ─────────────────────────────────────────────

export async function getMyMemories(): Promise<MemoryType[]> {
  const token = await getToken();
  if (!token) return [];
  try {
    const res = await fetch(`${API_URL}/api/memories/memories/myself`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      next: { tags: ['my-memories'] },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.data?.items as MemoryType[]) || [];
  } catch {
    return [];
  }
}

export async function getMemory(id: number): Promise<MemoryType | null> {
  const token = await getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_URL}/api/memories/memories/${id}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      next: { tags: [`memory-${id}`] },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data?.data?.item as MemoryType) || null;
  } catch {
    return null;
  }
}

export async function createMemory(
  formData: FormData
): Promise<{ success?: true; memory?: MemoryType; error?: string }> {
  const token = await getToken();
  if (!token) return { error: 'لطفا وارد شوید' };
  try {
    const res = await fetch(`${API_URL}/api/memories/memories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: formData,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data?.message || 'خطا در ذخیره خاطره' };
    }
    const data = await res.json();
    revalidateTag('my-memories', {expire: 300});
    revalidateTag('friends-memories', {expire: 300});
    revalidateTag('explore-memories', {expire: 300});
    return { success: true, memory: data?.data?.item as MemoryType };
  } catch {
    return { error: 'خطا در اتصال به سرور' };
  }
}

export async function updateMemory(
  id: number,
  formData: FormData
): Promise<{ success?: true; memory?: MemoryType; error?: string }> {
  const token = await getToken();
  if (!token) return { error: 'لطفا وارد شوید' };
  try {
    formData.append('_method', 'PUT');
    const res = await fetch(`${API_URL}/api/memories/memories/${id}`, {
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
      return { error: data?.message || 'خطا در ویرایش خاطره' };
    }
    const data = await res.json();
    revalidateTag('my-memories', {expire: 300});
    revalidateTag(`memory-${id}`, {expire: 300});
    revalidateTag('friends-memories', {expire: 300});
    revalidateTag('explore-memories', {expire: 300});
    return { success: true, memory: data?.data?.item as MemoryType };
  } catch {
    return { error: 'خطا در اتصال به سرور' };
  }
}

export async function deleteMemory(
  id: number
): Promise<{ success?: true; error?: string }> {
  const token = await getToken();
  if (!token) return { error: 'لطفا وارد شوید' };
  try {
    const res = await fetch(`${API_URL}/api/memories/memories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data?.message || 'خطا در حذف خاطره' };
    }
    revalidateTag('my-memories', {expire: 300});
    revalidateTag('friends-memories', {expire: 300});
    revalidateTag('explore-memories', {expire: 300});
    return { success: true };
  } catch {
    return { error: 'خطا در اتصال به سرور' };
  }
}
