import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Updater } from '@tanstack/vue-table'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getExcerpt(str: string) {
  let excerpt = str;
  if (str.length > 128) {
    excerpt = str.substring(0, 128) + "...";
  }
  return excerpt;
}

export const parseOrderStatus = (status: number) => {
  return {
    0: 'canceled',
    1: 'done',
    2: 'processing',
  }[status];
};

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value = typeof updaterOrValue === 'function'
    ? updaterOrValue(ref.value)
    : updaterOrValue
}