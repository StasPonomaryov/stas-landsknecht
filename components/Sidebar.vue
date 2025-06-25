<template>
  <aside class="site-sidebar " :class="{ collapsed: !sidebarExpanded }">
    <div id="menuToggler" class="sidebar-control">
      <span @click="toggleSidebar">
        {{ sidebarExpanded ? "⬅️" : "➡️" }}
      </span>
    </div>
    <div class="sidebar-content">
      <ul>
        <li @click="toggleSidebar">
          📝 <NuxtLink to="/tasks">Tasks</NuxtLink>
          <ul>
            <li>
              <NuxtLink to="/tasks/add">Add task</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/tasks/edit">Edit task</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/tasks/remove">Remove task</NuxtLink>
            </li>
          </ul>
        </li>
        <li @click="toggleSidebar">
          👨 <NuxtLink to="/clients">Clients</NuxtLink>
          <ul>
            <li>
              <NuxtLink to="/clients/add">Add client</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/clients/edit">Edit client</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/clients/remove">Remove client</NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
const sidebarExpanded = ref(false);
function toggleSidebar() {
  sidebarExpanded.value = !sidebarExpanded.value;
}
</script>

<style scoped></style>