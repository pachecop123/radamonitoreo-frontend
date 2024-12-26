<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">Sistema de Facturación</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/productos">Productos</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/clientes">Clientes</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/proveedores">Proveedores</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/ventas">Ventas</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/compras">Compras</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/compras">Inventarios</router-link>
            </li>
            <!-- Agrega más enlaces según los módulos que tengas -->
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'Navbar'
  };
  </script>
  
  <style scoped>
  /* Estilos específicos para este componente */
  </style>