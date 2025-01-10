import type { Client } from "~/types";

export const columns = [
  {
    key: 'id',
    header: 'ID',
    cell: ({ row }: { row: Client }) => row.id
  },
  {
    key: 'name',
    header: 'NAME',
    cell: ({ row }: { row: Client }) => row.name
  },
  {
    key: 'description',
    header: 'DESCRIPTION',
    cell: ({ row }: { row: Client }) => row.description
  },
  {
    key: 'contacts',
    header: 'CONTACTS',
    cell: ({ row }: { row: Client }) => row.contacts
  }
];
