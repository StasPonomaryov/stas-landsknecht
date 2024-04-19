<template>
  <aside class="site-sidebar " :class="{ collapsed: !sidebarExpanded }">
    <div id="menuToggler" class="sidebar-control">
      <span @click="toggleSidebar">
        {{ sidebarExpanded ? "⬅️" : "➡️" }}
      </span>
    </div>
    <div class="sidebar-content">
      <ul>
        <li>
          📝 <a href="#">Orders</a>
          <ul>
            <li>
              <a href="#">Add order</a>
            </li>
            <li>
              <a href="#">Edit order</a>
            </li>
            <li>
              <a href="#">Remove order</a>
            </li>
          </ul>
        </li>
        <li>
          👨 <a href="#">Customers</a>
          <ul>
            <li>
              <NuxtLink to="/customers/add">Add customer</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/customers/edit">Edit customer</NuxtLink>
            </li>
            <li>
              <a href="#">Remove customer</a>
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