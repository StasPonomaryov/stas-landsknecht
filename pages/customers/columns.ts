export const columns = [
  {
    key: 'id',
    header: 'ID',
    cell: ({ row: Customer }) => row.id
  },
  {
    key: 'name',
    header: 'NAME'
  },
  {
    key: 'description',
    header: 'DESCRIPTION'
  },
  {
    key: 'contacts',
    header: 'CONTACTS'
  }
];
