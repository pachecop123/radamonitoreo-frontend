import { createStore } from 'vuex'
import { reactive } from 'vue';

export const store = reactive({
  isAuthenticated: false,
  login() {
    this.isAuthenticated = true;
  },
  logout() {
    this.isAuthenticated = false;
  }
});

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
