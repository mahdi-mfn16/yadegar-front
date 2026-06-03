'use server'

import type { MemoryType } from '@/types/memoryType';

const API_URL = process.env.API_URL || 'http://localhost:8000';

export interface ExploreResult {
  items: MemoryType[];
  currentPage: number;
  lastPage: number;
  total: number;
}

export async function getPublicMemories(page: number = 1, limit: number = 10): Promise<ExploreResult> {
  try {
    const params = new URLSearchParams();
    params.append('filters[visibility][]', 'public');
    params.append('filters[visibility][]', 'anonymous');
    params.append('sort[by]', 'created_at');
    params.append('sort[dir]', 'desc');
    params.append('page', String(page));
    params.append('limit', String(limit));

    const res = await fetch(`${API_URL}/api/memories/memories?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60, tags: ['explore-memories'] },
    });

    if (!res.ok) return { items: [], currentPage: 1, lastPage: 1, total: 0 };

    const data = await res.json();
    const items = (data?.data?.items as MemoryType[]) || [];
    const links = data?.data?.links ?? {};

    return {
      items,
      currentPage: links.current_page ?? page,
      lastPage: links.last_page ?? 1,
      total: links.total ?? items.length,
    };
  } catch {
    return { items: [], currentPage: 1, lastPage: 1, total: 0 };
  }
}
