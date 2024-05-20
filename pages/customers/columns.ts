export const columns = [
  {
    key: 'id',
    header: 'ID',
    cell: ({ row }: { row: Customer }) => row.id
  },
  {
    key: 'name',
    header: 'NAME',
    cell: ({ row }: { row: Customer }) => row.name
  },
  {
    key: 'description',
    header: 'DESCRIPTION',
    cell: ({ row }: { row: Customer }) => row.description
  },
  {
    key: 'contacts',
    header: 'CONTACTS',
    cell: ({ row }: { row: Customer }) => row.contacts
  }
];
