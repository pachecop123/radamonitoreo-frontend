<template>
  <div class="d-flex" id="dashboard-layout">
    <!-- Sidebar -->
    <nav id="sidebar" class="bg-dark text-white p-3">
      <h3 class="text-center">GMR</h3>
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link to="/dashboard" class="nav-link text-white">
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
          <li class="nav-item">
            <a href="#" class="nav-link">
              <i class="bi bi-bell"></i>
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">
              <i class="bi bi-person-circle"></i>
            </a>
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
export default {
  methods: {
    toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('d-none');
    },
  },
};
</script>

<style>
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
</style>