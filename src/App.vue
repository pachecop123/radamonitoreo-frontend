<template>
  <div id="app">
    <DashboardLayout v-if="store.isAuthenticated" />
    <router-view v-else />
  </div>
</template>

<script>
import { store } from './store';
import DashboardLayout from './components/DashboardLayout.vue';

export default {
  components: {
    DashboardLayout,
  },
  setup() {
    return { store };
  },
};
</script>

<style>
/* Estilos globales opcionales */
body {
  font-family: Arial, sans-serif;
}
</style>
