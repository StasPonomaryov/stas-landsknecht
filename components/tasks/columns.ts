import type { ColumnDef } from "@tanstack/vue-table"
import { format } from 'date-fns/format';
import { ArrowUpDown, ChevronDown } from 'lucide-vue-next'
import { getExcerpt, parseOrderStatus } from "~/lib/utils"
import type { NewTask } from "~/types"
import Button from "../ui/button/Button.vue";
import { Checkbox } from '@/components/ui/checkbox'

export const columns: ColumnDef<NewTask>[] = [
  {
    id: 'select',
    header: ({ table }) => h(Checkbox, {
      'checked': table.getIsAllPageRowsSelected(),
      'onUpdate:checked': (value: boolean) => table.toggleAllPageRowsSelected(!!value),
      'ariaLabel': 'Select all',
    }),
    cell: ({ row }) => h(Checkbox, {
      'checked': row.getIsSelected(),
      'onUpdate:checked': (value: boolean) => row.toggleSelected(!!value),
      'ariaLabel': 'Select row',
    }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: () => h('div', { class: 'text-sm w-[190px]' }, 'Title'),
    cell: ({ row }) => {
      const title: string = row.getValue('title')

      return h('div', { class: 'text-left font-medium w-[190px]' }, title)
    },
  },
  {
    accessorKey: 'text',
    header: () => h('div', { class: 'text-center text-sm' }, 'Description'),
    cell: ({ row }) => {
      const description: string = row.getValue('text')
      const excerpt = description?.length
        ? getExcerpt(description)
        : '';

      return h('div', { class: 'text-left font-medium]' }, excerpt)
    },
  },
  {
    accessorKey: 'start',
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        class: 'font-bold text-sm w-[90px]',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      },
        () => ['Start', h(ArrowUpDown, { class: 'h-4 w-4' })]
      )
    },
    cell: ({ row }) => {
      const start: string = row.getValue('start')
      const formatted = format(new Date(start), 'dd-MM-yyyy');

      return h('div', { class: 'text-left font-medium w-[90px]' }, formatted)
    },
  },
  {
    accessorKey: 'priceStart',
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        class: 'font-bold text-sm',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      },
        () => ['Prepay', h(ArrowUpDown, { class: 'h-4 w-4' })]
      )
    },
    cell: ({ row }) => {
      const start: string = row.getValue('priceStart')
      const prePayment = start && start !== '0' ? Number(start).toFixed(2) : 0;

      return h('div', { class: 'text-left font-medium' }, prePayment)
    },
  },
  {
    accessorKey: 'end',
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        class: 'font-bold text-sm w-[90px]',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      },
        () => ['End', h(ArrowUpDown, { class: 'h-4 w-4' })]
      )
    },
    cell: ({ row }) => {
      const end: string = row.getValue('end')
      const formatted = end?.length ? format(new Date(end), 'dd-MM-yyyy') : '-';

      return h('div', { class: 'text-left font-medium w-[90px]' }, formatted)
    },
    enableResizing: false,
    size: 200,
  },
  {
    accessorKey: 'priceEnd',
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        class: 'font-bold text-sm',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      },
        () => ['Postpay', h(ArrowUpDown, { class: 'h-4 w-4' })]
      )
    },
    cell: ({ row }) => {
      const end: string = row.getValue('priceEnd')
      const postPayment = end && end !== '0' ? Number(end).toFixed(2) : 0;

      return h('div', { class: 'text-left font-medium' }, postPayment)
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        class: 'font-bold text-sm w-[90px]',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      },
        () => ['Status', h(ArrowUpDown, { class: 'h-4 w-4' })]
      )
    },
    cell: ({ row }) => {
      const statusRaw: string = row.getValue('status')
      let status = parseOrderStatus(Number(statusRaw))

      return h('div', { class: 'text-left font-medium' }, status)
    },
  },
]