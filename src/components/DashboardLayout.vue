<template>
  <div class="d-flex" id="dashboard-layout">
    <!-- Sidebar -->
    <nav id="sidebar" class="bg-dark text-white p-3">
      <h3 class="text-center">GMR</h3>
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link to="/home" class="nav-link text-white">
            <i class="bi bi-house-door"></i> Inicio
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/compras" class="nav-link text-white">
            <i class="bi bi-cart-check"></i> Compras
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/clientes" class="nav-link text-white">
            <i class="bi bi-people-fill"></i> Clientes
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/inventarios" class="nav-link text-white">
            <i class="bi bi-box-seam"></i> Inventarios
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/productos" class="nav-link text-white">
            <i class="bi bi-box"></i> Productos
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/ventas" class="nav-link text-white">
            <i class="bi bi-cash-stack"></i> Ventas
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/cotizaciones" class="nav-link text-white">
            <i class="bi bi-file-earmark-text"></i> Cotizaciones
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/gastos" class="nav-link text-white">
            <i class="bi bi-wallet2"></i> Gastos
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/proveedores" class="nav-link text-white">
            <i class="bi bi-wallet2"></i> Proveedores
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/cuentas-por-cobrar" class="nav-link text-white">
            <i class="bi bi-cash"></i> Ctas. Por Cobrar
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/cuentas-por-pagar" class="nav-link text-white">
            <i class="bi bi-credit-card"></i> Ctas. Por Pagar
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/consulta-ingresos" class="nav-link text-white">
            <i class="bi bi-credit-card"></i> Consulta Ingresos
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/settings" class="nav-link text-white">
            <i class="bi bi-gear"></i> Configuración
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Main Content -->
    <div class="flex-grow-1">
      <!-- Header -->
      <header class="navbar navbar-expand-lg navbar-light bg-light px-4">
        <button class="btn btn-outline-secondary" @click="toggleSidebar">
          <i class="bi bi-list"></i>
        </button>
        <span class="navbar-brand ms-3">Gps Monitoreo RADA</span>
        <ul class="navbar-nav ms-auto">
          <li class="nav-item dropdown">
            <a href="#" class="nav-link dropdown-toggle" id="userMenu" role="button" @click.prevent="toggleDropdown"
              aria-expanded="false">
              <i class="bi bi-person-circle"></i>
            </a>
            <ul class="dropdown-menu dropdown-menu-end" :class="{ show: isDropdownOpen }" aria-labelledby="userMenu">
              <li>
                <router-link to="/settings" class="dropdown-item">
                  <i class="bi bi-gear"></i> Configuración
                </router-link>
              </li>
              <li>
                <hr />
              </li>
              <li>
                <button class="dropdown-item" @click="logout">
                  <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
                </button>
              </li>
            </ul>
          </li>

        </ul>
      </header>

      <!-- Page Content -->
      <main class="p-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "DashboardLayout",
  setup() {
    const router = useRouter();
    const isDropdownOpen = ref(false); // Estado reactivo para el menú desplegable

    const toggleSidebar = () => {
      const sidebar = document.getElementById("sidebar");
      sidebar.classList.toggle("d-none");
    };

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value; // Alterna el estado del menú desplegable
    };

    const logout = () => {
      // Elimina el token de autenticación
      localStorage.removeItem("access_token");
      // Redirige al usuario a la página de inicio de sesión
      router.push({ name: "Login" });
    };

    return {
      toggleSidebar,
      toggleDropdown,
      logout,
      isDropdownOpen,
    };
  },
};
</script>


<style scoped>
/* Dashboard layout styles */
#dashboard-layout {
  height: 100vh;
  overflow: hidden;
}

#sidebar {
  width: 250px;
  min-height: 100vh;
}

#sidebar .nav-link {
  font-size: 16px;
}

#sidebar .nav-link:hover {
  background-color: #495057;
}

main {
  overflow-y: auto;
  height: calc(100vh - 56px);
  /* Altura restante después del header */
}

.dropdown-menu {
  position: absolute;
  right: 0; /* Alinea el menú al borde derecho del contenedor */
  transform: translateX(10%);
  z-index: 1050; /* Asegura que el menú se renderice sobre otros elementos */
  min-width: 200px; /* Asegura un tamaño mínimo adecuado */
}

</style>