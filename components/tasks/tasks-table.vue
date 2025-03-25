<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef, SortingState, ColumnFiltersState, } from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/vue-table'
import TasksTablePagination from './tasks-table-pagination.vue'
import { valueUpdater } from '~/lib/utils'
import { Pencil1Icon, TrashIcon } from '@radix-icons/vue';

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}>()

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const rowSelection = ref({})

const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  getFilteredRowModel: getFilteredRowModel(),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get rowSelection() { return rowSelection.value },
  },
})
</script>

<template>
  <div class="rounded-md">
    <div class="flex items-center justify-between py-4">
      <Input class="max-w-sm" placeholder="Filter by description..."
        :model-value="table.getColumn('text')?.getFilterValue() as string"
        @update:model-value=" table.getColumn('text')?.setFilterValue($event)" />
      <div class="flex items-center space-x-2"
        v-if="!table.getIsAllPageRowsSelected() && table.getIsSomePageRowsSelected()">
        <Button variant="destructive"><TrashIcon class="w-4 h-4" />Remove</Button>
        <Button v-if="table.getFilteredSelectedRowModel().rows.length === 1" variant="outline"><Pencil1Icon class="w-4 h-4" />Edit</Button>
      </div>
    </div>
    <Table class="table">
      <TableHeader class="table-head">
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead v-for="header in headerGroup.headers" :key="header.id">
            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
              :props="header.getContext()" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow v-for="row in table.getRowModel().rows" :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined">
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
  <div class="mt-4">
    <TasksTablePagination :table="table" />
  </div>
</template>