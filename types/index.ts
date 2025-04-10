export const STATUSES = ['processing', 'done', 'cancelled'];
export const STATUSES_VALIDATION = ['processing', 'done', 'cancelled'] as const;

export type NewClient = {
  contacts: string;
  description: string;
  name: string;
  users: string[];
}

export type Client = NewClient & {
  id: string;
}

export type NewTask = {
  clientId: string;
  end?: string;
  hours: number;
  priceEnd?: number;
  priceStart: number;
  start: string;
  status: number;
  text?: string;
  title: string;
  users: string[];
}

export type Task = NewTask & {
  id: string;
}