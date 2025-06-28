<template>
  <div class="flex items-center justify-between px-2">
    <div class="flex-1 text-sm text-muted-foreground">
      {{ table.getFilteredSelectedRowModel().rows.length }} of
      {{ table.getFilteredRowModel().rows.length }} row(s) selected.
    </div>
    <div class="flex items-center space-x-6 lg:space-x-8">
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium !mb-0">
          Rows per page
        </p>

        <USelect 
          :model-value="table.getState().pagination.pageSize"
          @update:model-value="onPagesizeChange"
          :items="pageSizeOptions"
          class="w-[70px]"
        />
      </div>
      
      <div class="flex w-[100px] items-center justify-center text-sm font-medium">
        Page {{ table.getState().pagination.pageIndex + 1 }} of
        {{ table.getPageCount() }}
      </div>
      
      <div class="flex items-center space-x-2">
        <Button 
          variant="outline" 
          class="themed-background hidden w-8 h-8 p-0 lg:flex"
          :disabled="!table.getCanPreviousPage()" 
          @click="table.setPageIndex(0)"
        >
          <span class="sr-only">Go to first page</span>
          <ChevronsLeft class="themed-text w-4 h-4" />
        </Button>
        
        <Button 
          variant="outline" 
          class="themed-background w-8 h-8 p-0" 
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          <span class="sr-only">Go to previous page</span>
          <ChevronLeft class="themed-text w-4 h-4" />
        </Button>
        
        <Button 
          variant="outline" 
          class="themed-background w-8 h-8 p-0" 
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          <span class="sr-only">Go to next page</span>
          <ChevronRight class="themed-text w-4 h-4" />
        </Button>
        
        <Button 
          variant="outline" 
          class="themed-background hidden w-8 h-8 p-0 lg:flex"
          :disabled="!table.getCanNextPage()" 
          @click="table.setPageIndex(table.getPageCount() - 1)"
        >
          <span class="sr-only">Go to last page</span>
          <ChevronsRight class="themed-text w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="TData, TValue">
import { type Table } from '@tanstack/vue-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';

interface DataTablePaginationProps {
  table: Table<TData>
};

const props = defineProps<DataTablePaginationProps>();

const pageSizeOptions = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '30', value: 30 },
  { label: '40', value: 40 },
  { label: '50', value: 50 }
];

const onPagesizeChange = (value: number) => {
  props.table.setPageSize(value);
};
</script>