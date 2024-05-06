<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead v-for="header in props.columns" :key="header.key">
          {{ header.header }}
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <template v-if="data.length">
        <TableRow v-for="row in data" :key="row.id">
          <TableCell v-for="customer in row">{{ customer }}</TableCell>
        </TableRow>
      </template>
      <template v-else>
        <TableRow>
          😔 No data
        </TableRow>
      </template>
    </TableBody>
  </Table>
</template>

<script setup>
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './ui/table';
const props = defineProps(['columns', 'data']);
</script>

<style scoped></style>