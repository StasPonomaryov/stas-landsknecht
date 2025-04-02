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
          📝 <NuxtLink to="#">Tasks</NuxtLink>
          <ul>
            <li>
              <a href="/tasks/add">Add task</a>
            </li>
            <li>
              <a href="#">Edit task</a>
            </li>
            <li>
              <a href="#">Remove task</a>
            </li>
          </ul>
        </li>
        <li @click="toggleSidebar">
          👨 <NuxtLink to="#">Clients</NuxtLink>
          <ul>
            <li>
              <NuxtLink to="#">Add client</NuxtLink>
            </li>
            <li>
              <NuxtLink to="#">Edit client</NuxtLink>
            </li>
            <li>
              <NuxtLink to="#">Remove client</NuxtLink>
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