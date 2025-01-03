<template>
  <div class="container mt-3">
    <div class="card shadow">
      <div class="card-header text-center bg-primary text-white">
        <h3>Consulta de Ingresos</h3>
      </div>
      <div class="card-body">
        <!-- Filtros de Fecha -->
        <div class="row mb-4">
          <div class="col-md-6">
            <label for="fechaInicio" class="form-label">Fecha de Inicio</label>
            <input type="date" id="fechaInicio" class="form-control" v-model="fechaInicio" />
          </div>
          <div class="col-md-6">
            <label for="fechaFin" class="form-label">Fecha de Fin</label>
            <input type="date" id="fechaFin" class="form-control" v-model="fechaFin" />
          </div>
        </div>
        <div class="d-flex justify-content-end mb-3">
          <button class="btn btn-primary" @click="filtrarIngresos">Consultar</button>
        </div>

        <!-- Tabla de Ingresos -->
        <div class="table-responsive">
          <table class="table table-bordered table-hover table-striped">
            <thead class="bg-light">
              <tr>
                <th>Fecha</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Costo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(ingreso, index) in ingresosFiltrados" :key="index">
                <td>{{ ingreso.fecha }}</td>
                <td>{{ ingreso.producto }}</td>
                <td>{{ formatCurrency(ingreso.precio) }}</td>
                <td>{{ ingreso.cantidad }}</td>
                <td>{{ formatCurrency(ingreso.subtotal) }}</td>
                <td>{{ formatCurrency(ingreso.costo) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Resumen de Ingresos -->
        <div class="row text-center mt-4">
          <div class="col-md-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">No. Ventas</h5>
                <p class="card-text">{{ ingresosFiltrados.length }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-info text-white">
              <div class="card-body">
                <h5 class="card-title">Total Venta</h5>
                <p class="card-text">{{ formatCurrency(totalVenta) }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-danger text-white">
              <div class="card-body">
                <h5 class="card-title">Total Costos</h5>
                <p class="card-text">{{ formatCurrency(totalCostos) }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-success text-white">
              <div class="card-body">
                <h5 class="card-title">Utilidad Total</h5>
                <p class="card-text">{{ formatCurrency(utilidadTotal) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fechaInicio: '',
      fechaFin: '',
      ingresos: [
        { fecha: '2025-01-01', producto: 'Producto A', precio: 10000, cantidad: 5, subtotal: 50000, costo: 30000 },
        { fecha: '2025-01-02', producto: 'Producto B', precio: 20000, cantidad: 3, subtotal: 60000, costo: 40000 },
        { fecha: '2025-01-03', producto: 'Producto C', precio: 15000, cantidad: 4, subtotal: 60000, costo: 35000 },
      ],
    };
  },
  computed: {
    ingresosFiltrados() {
      if (!this.fechaInicio || !this.fechaFin) return this.ingresos;
      const inicio = new Date(this.fechaInicio);
      const fin = new Date(this.fechaFin);
      return this.ingresos.filter((ingreso) => {
        const fecha = new Date(ingreso.fecha);
        return fecha >= inicio && fecha <= fin;
      });
    },
    totalVenta() {
      return this.ingresosFiltrados.reduce((sum, ingreso) => sum + ingreso.subtotal, 0);
    },
    totalCostos() {
      return this.ingresosFiltrados.reduce((sum, ingreso) => sum + ingreso.costo, 0);
    },
    utilidadTotal() {
      return this.totalVenta - this.totalCostos;
    },
  },
  methods: {
    filtrarIngresos() {
      if (!this.fechaInicio || !this.fechaFin) {
        alert('Por favor, selecciona ambas fechas.');
        return;
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    },
  },
};
</script>

<style scoped>
.card-header {
  font-size: 1.5rem;
}
.card-title {
  font-size: 1.2rem;
}
<style scoped>
.card-header {
  font-size: 1.5rem;
}
button {
  min-width: 100px;
}
</style>
