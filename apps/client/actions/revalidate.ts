'use server';

import { revalidatePath } from 'next/cache';

export async function revalid() {
  await revalidatePath('/app/dashboard');
  return '1';
}
