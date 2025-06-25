import { h } from 'vue';
import type { ColumnDef } from "@tanstack/vue-table";
import { format } from 'date-fns/format';
import { ArrowUpDown } from 'lucide-vue-next';
import { getExcerpt } from "~/lib/utils";
import type { Client } from "~/types";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export const columns: ColumnDef<Client>[] = [
  {
    id: 'select',
    header: ({ table }) => h(Checkbox, {
      'modelValue': table.getIsAllPageRowsSelected(),
      'onUpdate:modelValue': (value: boolean | "indeterminate") => table.toggleAllPageRowsSelected(!!value),
      'ariaLabel': 'Select all',
      'class': 'bg-white'
    }),
    cell: ({ row }) => h(Checkbox, {
      'modelValue': row.getIsSelected(),
      'onUpdate:modelValue': (value: boolean | "indeterminate") => row.toggleSelected(!!value),
      'ariaLabel': 'Select row',
      'class': 'bg-white'
    }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: () => h('div', { class: 'text-sm w-[190px]' }, 'Name'),
    cell: ({ row }) => {
      const name: string = row.getValue('name')

      return h('div', { class: 'text-left truncate font-medium w-[190px]' }, name)
    },
  },
  {
    accessorKey: 'description',
    header: () => h('div', { class: 'text-center text-sm' }, 'Description'),
    cell: ({ row }) => {
      const description: string = row.getValue('description')
      const excerpt = description?.length
        ? getExcerpt(description)
        : '';

      return h('div', { class: 'text-left font-medium]' }, excerpt)
    },
  },
  {
    accessorKey: 'contacts',
    header: () => h('div', { class: 'text-center text-sm' }, 'Contacts'),
    cell: ({ row }) => {
      const contacts: string = row.getValue('contacts')
      const excerpt = contacts?.length
        ? getExcerpt(contacts)
        : '';

      return h('div', { class: 'text-left font-medium]' }, excerpt)
    },
  },
]