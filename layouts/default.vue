<template>
  <div class="site-wrapper">
    <Header />
    <div class="content-wrapper">
      <Sidebar />
      <div class="site-content">
        <div class="content-control">
          <slot />
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style scoped></style>