import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Productos from "../views/Productos.vue";
import Clientes from "../views/Clientes.vue";
import Proveedores from "../views/Proveedores.vue";
import Ventas from "../views/Ventas.vue";
import Compras from "../views/Compras.vue";
import Inventarios from "../views/Inventarios.vue";
import About from "../views/About.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import { store } from '../store';

// Importa los demás componentes según los necesites

const routes = [
  { path: "/", name: "Login", component: Login },
  {path : "/register", name: "Register", component: Register},
  { path: "/home", name: "Home", component: Home },
  { path: "/productos", name: "Productos", component: Productos },
  { path: "/clientes", name: "Clientes", component: Clientes },
  { path: "/proveedores", name: "Proveedores", component: Proveedores },
  { path: "/ventas", name: "Ventas", component: Ventas },
  { path: "/compras", name: "Compras", component: Compras },
  { path: "/inventarios", name: "Inventarios", component: Inventarios },
  { path: "/about", name: "About", component: About },
  // Agrega las rutas para los demás módulos
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !store.isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
