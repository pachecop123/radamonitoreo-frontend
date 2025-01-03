<template>
  <div class="container mt-3">
    <div class="card shadow">
      <div class="card-header text-center bg-primary text-white">
        <h3>Cuentas por Cobrar</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <!-- Panel Izquierdo: Clientes con Deudas -->
          <div class="col-md-4">
            <h5>Clientes con Deudas</h5>
            <div class="list-group">
              <button
                v-for="(cliente, index) in clientesConDeudas"
                :key="index"
                class="list-group-item list-group-item-action"
                :class="{ active: clienteSeleccionado === cliente }"
                @click="seleccionarCliente(cliente)"
              >
                {{ cliente.nombre }}
              </button>
            </div>
          </div>

          <!-- Panel Derecho: Detalle de Deudas y Abonos -->
          <div class="col-md-8">
            <h5>Detalle de Deudas</h5>
            <div class="table-responsive mb-4">
              <table class="table table-bordered table-hover">
                <thead class="bg-light">
                  <tr>
                    <th>Fecha</th>
                    <th>Nombre</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(deuda, index) in detalleDeudasFiltradas" :key="index">
                    <td>{{ deuda.fecha }}</td>
                    <td>{{ deuda.cliente }}</td>
                    <td>{{ formatCurrency(deuda.total) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h5>Historial de Abonos</h5>
            <div class="table-responsive mb-4">
              <table class="table table-bordered table-hover">
                <thead class="bg-light">
                  <tr>
                    <th>Total</th>
                    <th>Abono</th>
                    <th>Saldo Pendiente</th>
                    <th>Fecha de Pago</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(abono, index) in historialAbonosFiltrados" :key="index">
                    <td>{{ formatCurrency(abono.total) }}</td>
                    <td>{{ formatCurrency(abono.abono) }}</td>
                    <td>{{ formatCurrency(abono.saldoPendiente) }}</td>
                    <td>{{ abono.fechaPago }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="abonoInput">Abono</label>
                  <input
                    type="number"
                    id="abonoInput"
                    class="form-control"
                    v-model.number="nuevoAbono"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="saldoPendiente">Saldo Pendiente</label>
                  <input
                    type="text"
                    id="saldoPendiente"
                    class="form-control"
                    :value="formatCurrency(calcularSaldoPendiente())"
                    readonly
                  />
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-end">
              <button class="btn btn-primary me-2" @click="guardarAbono">Guardar</button>
              <button class="btn btn-danger" @click="eliminarCliente">Eliminar</button>
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
      clientesConDeudas: [
        { nombre: 'Carlos Mora' },
      ],
      detalleDeudas: [
        { fecha: '2025-01-03', cliente: 'Carlos Mora', total: 28000 },
      ],
      historialAbonos: [
        { total: 28000, abono: 5000, saldoPendiente: 23000, fechaPago: '2025-01-03' },
      ],
      clienteSeleccionado: null,
      nuevoAbono: 0,
    };
  },
  computed: {
    detalleDeudasFiltradas() {
      return this.detalleDeudas.filter(
        (deuda) => deuda.cliente === this.clienteSeleccionado?.nombre
      );
    },
    historialAbonosFiltrados() {
      return this.historialAbonos.filter(
        (abono) => abono.total === this.detalleDeudasFiltradas[0]?.total
      );
    },
  },
  methods: {
    seleccionarCliente(cliente) {
      this.clienteSeleccionado = cliente;
    },
    calcularSaldoPendiente() {
      const deuda = this.detalleDeudasFiltradas[0];
      if (!deuda) return 0;
      const saldoActual = deuda.total - this.historialAbonosFiltrados.reduce((sum, abono) => sum + abono.abono, 0);
      return saldoActual - this.nuevoAbono;
    },
    guardarAbono() {
      if (this.nuevoAbono > 0 && this.clienteSeleccionado) {
        const saldoPendiente = this.calcularSaldoPendiente();
        this.historialAbonos.push({
          total: this.detalleDeudasFiltradas[0].total,
          abono: this.nuevoAbono,
          saldoPendiente,
          fechaPago: new Date().toISOString().split('T')[0],
        });
        this.nuevoAbono = 0;
      }
    },
    eliminarCliente() {
      if (this.clienteSeleccionado) {
        this.clientesConDeudas = this.clientesConDeudas.filter(
          (cliente) => cliente !== this.clienteSeleccionado
        );
        this.clienteSeleccionado = null;
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
.list-group-item {
  cursor: pointer;
}
.list-group-item.active {
  background-color: #007bff;
  color: white;
}
button {
  min-width: 100px;
}
</style>
