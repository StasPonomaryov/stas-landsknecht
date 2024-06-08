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
        <TableRow v-for="row in data" :key="row.id" @click="() => handleRowSelect(row.id)">
          <TableCell :class="selectedRow === row.id && 'selected'" v-for="customer in row">{{ customer }}</TableCell>
        </TableRow>
      </template>
      <template v-else>
        <TableRow>
          😔 No data
        </TableRow>
      </template>
    </TableBody>
  </Table>
  <div class="actions" v-if="selectedRow">
    <EditButton @click="redirectToPage('edit')" />
    <RemoveButton @click="() => redirectToPage('remove')" />
  </div>
</template>

<script setup>
const router = useRouter();
const props = defineProps(['columns', 'data']);
const selectedRow = ref(null);

function handleRowSelect(id) {
  if (id === selectedRow.value) return selectedRow.value = null;
  return selectedRow.value = id;
}

function redirectToPage(pageId) {
  return router.push(`/customers/${pageId}?id=${selectedRow.value}`);
}
</script>

<style scoped>
.actions {
  margin: 1rem 0;
}
</style>