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