import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import Productos from "../views/Productos.vue";
import Clientes from "../views/Clientes.vue";
import Proveedores from "../views/Proveedores.vue";
import Ventas from "../views/Ventas.vue";
import Compras from "../views/Compras.vue";
import Inventarios from "../views/Inventarios.vue";
import Cotizaciones from "../views/Cotizaciones.vue";
import CuentasPorCobrar from "../views/CuentasPorCobrar.vue";
import CuentasPorPagar from "../views/CuentasPorPagar.vue";
import ConsultaIngresos from "../views/ConsultaIngresos.vue";
import Settings from "../views/Settings.vue";
import Gastos from "../views/Gastos.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import NotFound from "../components/404.vue";

const routes = [
  { path: "/", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },

  {path: "/home", name: "Home", component: Home, meta: { requiresAuth: true } },

  // Rutas protegidas
  { path: "/productos", name: "Productos", component: Productos, meta: { requiresAuth: true } },
  { path: "/clientes", name: "Clientes", component: Clientes, meta: { requiresAuth: true } },
  { path: "/proveedores", name: "Proveedores", component: Proveedores, meta: { requiresAuth: true } },
  { path: "/ventas", name: "Ventas", component: Ventas, meta: { requiresAuth: true } },
  { path: "/compras", name: "Compras", component: Compras, meta: { requiresAuth: true } },
  { path: "/inventarios", name: "Inventarios", component: Inventarios, meta: { requiresAuth: true } },
  { path: "/cotizaciones", name: "Cotizaciones", component: Cotizaciones, meta: { requiresAuth: true } },
  { path: "/gastos", name: "Gastos", component: Gastos, meta: { requiresAuth: true } },
  { path: "/cuentas-por-cobrar", name: "CuentasPorCobrar", component: CuentasPorCobrar, meta: { requiresAuth: true } },
  { path: "/cuentas-por-pagar", name: "CuentasPorPagar", component: CuentasPorPagar, meta: { requiresAuth: true } },
  { path: "/consulta-ingresos", name: "ConsultaIngresos", component: ConsultaIngresos, meta: { requiresAuth: true } },
  { path: "/settings", name: "Settings", component: Settings, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware para proteger rutas
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("access_token") !== null; // Verifica si el usuario está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "Login" }); // Redirige al login si no está autenticado
  } else {
    next(); // Permite el acceso
  }
});

export default router;
