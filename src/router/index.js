import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../components/DashboardLayout.vue";
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
import About from "../views/About.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import { store } from "../store";
import DashboardLayout from "../components/DashboardLayout.vue";

// Importa los demás componentes según los necesites

const routes = [
  {
    path: "/dashboard",
    component: DashboardLayout,
    children: [
      { path: "/productos", name: "Productos", component: Productos },
      { path: "/clientes", name: "Clientes", component: Clientes },
      { path: "/proveedores", name: "Proveedores", component: Proveedores },
      { path: "/ventas", name: "Ventas", component: Ventas },
      { path: "/compras", name: "Compras", component: Compras },
      { path: "/inventarios", name: "Inventarios", component: Inventarios },
      { path: "/about", name: "About", component: About },
      { path: '/cotizaciones', component: Cotizaciones },
      { path: '/gastos', component: Gastos },
      { path: '/cuentas-por-cobrar', component: CuentasPorCobrar },
      { path: '/cuentas-por-pagar', component: CuentasPorPagar },
      { path: '/consulta-ingresos', component: ConsultaIngresos },
      { path: '/settings', component: Settings },
      // Define una ruta por defecto o 404
      { path: '*', redirect: '/' }
      
      // Agrega las rutas para los demás módulos
    ],
  },
  { path: "/", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !store.isAuthenticated
  ) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
