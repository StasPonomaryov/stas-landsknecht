<template>
  <div class="rounded-md">
    <div class="flex items-center justify-between py-4">
      <UInput class="w-full max-w-lg" placeholder="Filter by description..."
        :model-value="table.getColumn('text')?.getFilterValue() as string"
        @update:model-value="table.getColumn('text')?.setFilterValue($event)" />
      <div class="flex items-center space-x-2" v-if="table.getFilteredSelectedRowModel().rows.length > 0">
        <Button variant="destructive" @click="emitRemoveSelected">
          <TrashIcon class="w-4 h-4" />Remove
        </Button>
        <Button v-if="table.getFilteredSelectedRowModel().rows.length === 1" variant="outline"
          @click="navigateToClient(table.getFilteredSelectedRowModel().rows[0].original.id)">
          <Pencil class="w-4 h-4" />Edit
        </Button>
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
    <ClientsTablePagination :table="table" />
  </div>
</template>

<script setup lang="ts">
import type { ColumnDef, SortingState, ColumnFiltersState } from '@tanstack/vue-table'
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
} from '@tanstack/vue-table';
import ClientsTablePagination from './clients-table-pagination.vue';
import { valueUpdater } from '~/lib/utils';
import { Pencil, TrashIcon } from 'lucide-vue-next';
import type { Client } from '~/types';
import { ref, useRouter } from '#imports';

const props = defineProps<{
  columns: ColumnDef<Client, any>[]
  data: Client[]
}>();
const emit = defineEmits(['removeSelected']);

const router = useRouter();
const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const rowSelection = ref({});

const emitRemoveSelected = () => {
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  emit('removeSelected', selectedRows.map((row) => row.original.id));
  table.resetRowSelection();
};

const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  getRowId: (originalRow) => (originalRow as any).id,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  enableRowSelection: true,
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get rowSelection() { return rowSelection.value },
  },
});
const navigateToClient = (clientId: string) => {
  router.push(`/clients/edit?id=${clientId}`);
};
const rowColor = (status: any) => {
  const color = 'bg-transparent';
  switch (status) {
    case 0:
      return 'bg-red-200';
    case 1:
      return 'bg-green-200';
    case 2:
      return 'bg-yellow-200';
    default:
      return color;
  }
};
</script>