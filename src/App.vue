<template>
  <div id="app">
    <v-app>
      <v-main>
        <v-container>
          <Navbar v-if="store.isAuthenticated" />
          <router-view />
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import { store } from './store';
import Navbar from './components/Navbar.vue';

export default {
  components: {
    Navbar
  },
  setup() {
    return { store };
  }
};
</script>

<style>
/* Estilos generales para la aplicación */
@import '~bootstrap/dist/css/bootstrap.css';
</style>