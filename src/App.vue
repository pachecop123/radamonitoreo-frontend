<template>
  <div id="app">
    <!-- Aplica automáticamente el DashboardLayout si la ruta está protegida -->
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import DashboardLayout from "./components/DashboardLayout.vue";

export default {
  computed: {
    layout() {
      // Aplica el DashboardLayout a rutas protegidas
      return this.$route.meta.requiresAuth ? DashboardLayout : "div";
    },
  },
};
</script>

<style>
/* Tu estilo aquí */
</style>
