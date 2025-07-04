import { h } from 'vue';
import type { ColumnDef } from "@tanstack/vue-table";
import { format } from 'date-fns/format';
import { ArrowUpDown } from 'lucide-vue-next';
import { getExcerpt } from "~/lib/utils";
import type { Task } from "~/types";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export const columns: ColumnDef<Task>[] = [
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
    accessorKey: 'title',
    header: () => h('div', { class: 'text-sm w-[190px]' }, 'Title'),
    cell: ({ row }) => {
      const title: string = row.getValue('title')

      return h('div', { class: 'text-left truncate font-medium w-[190px]' }, title)
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
    accessorKey: 'clientName',
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        class: 'font-bold text-sm w-[90px]',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      },
        () => ['Client', h(ArrowUpDown, { class: 'h-4 w-4' })]
      )
    },
    cell: ({ row }) => {
      const clientRaw: string = row.getValue('clientName')
      let client = clientRaw;

      return h('div', { class: 'text-left font-medium' }, client)
    },
  },
]