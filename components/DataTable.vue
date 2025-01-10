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
        <TableRow v-for="row in data" :key="row.id" @click="handleRowSelect(row.id, $event)">
          <TableCell :class="(selectedRow === row.id || selectedRows.includes(row.id)) && 'selected'" v-for="header in columns" :key="header.key">
            <slot v-if="updating && (selectedRow === row.id || selectedRows.includes(row.id))">
              <InputText :value="row[header.key]" @change="updateValue" />
            </slot>
            <slot v-else>{{ row[header.key] }}</slot>
          </TableCell>
        </TableRow>
      </template>
      <template v-else>
        <TableRow>
          😔 No data
        </TableRow>
      </template>
    </TableBody>
  </Table>
  <div class="actions" v-if="getSelectedRows > 0">
    <EditButton v-if="!updating" @click="editButtonClick" />
    <RemoveButton v-if="!updating" @click="removeButtonClick" />
    <UpdateButton v-if="updating" @click="updateRows" />
    <CancelButton v-if="updating" @click="() => updating = false" />
  </div>
  <div class="mt-2" v-if="getSelectedRows > 0">
    You selected {{ getSelectedRows }} row(s)    
  </div>
  <small>💡Tip: to select multiple rows you can hold Ctrl button and click on rows</small>
</template>

<script setup>
const router = useRouter();
const route = useRoute();
const props = defineProps(['columns', 'data']);
const emits = defineEmits(['updateData']);
const selectedRow = ref(null);
const selectedRows = ref([]);
const updating = ref(false);

function handleRowSelect(id, event) {
  event.preventDefault();
  console.log('>>>UPDATING?', updating.value);
  const ctrlPressed = event.ctrlKey;
  if (ctrlPressed) {
    if (selectedRow.value) {
      selectedRows.value.push(selectedRow.value);
      selectedRow.value = null;
    }
    if (selectedRows.value.includes(id)) {
      if (selectedRows.value.length > 1) { 
        return selectedRows.value = selectedRows.value.filter((r) => r !== id);
      }
      selectedRow.value = null;
      return selectedRows.value = [];
    }
    
    return selectedRows.value.push(id);
  }
  selectedRows.value = [];
  if (id === selectedRow.value) return selectedRow.value = null;

  return selectedRow.value = id;
}

function editButtonClick() {
  if (selectedRow.value) return redirectToPage('edit');
  return updating.value = true;
}

function removeButtonClick() {
  if (selectedRow.value) return redirectToPage('remove');
  return updating.value = true;
}

function redirectToPage(pageId) {
  return router.push(`${route.matched[0].path}/${pageId}?id=${selectedRow.value}`);
}

function updateValue(value) {
  console.log('>>>VALUE', value);
}

function updateRows() {
  console.log('>>>UPDATING ROWS');  
}

const getSelectedRows = computed(() => {
  if (selectedRow.value) return 1;
  return selectedRows.value.length;
});
</script>

<style scoped>
.actions {
  margin: 1rem 0;
}
</style>