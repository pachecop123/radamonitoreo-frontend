<template>
  <div class="container mt-3">
    <div class="card shadow">
      <div class="card-header text-center bg-primary text-white">
        <h3>Cuentas por Pagar</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <!-- Panel Izquierdo: Lista de Proveedores -->
          <div class="col-md-4">
            <h5>Lista de Proveedores</h5>
            <div class="list-group">
              <button
                v-for="(proveedor, index) in listaProveedores"
                :key="index"
                class="list-group-item list-group-item-action"
                :class="{ active: proveedorSeleccionado === proveedor }"
                @click="seleccionarProveedor(proveedor)"
              >
                {{ proveedor.nombre }}
              </button>
            </div>
          </div>

          <!-- Panel Derecho: Detalle de Pagos y Abonos -->
          <div class="col-md-8">
            <h5>Documentos</h5>
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
                  <tr v-for="(pago, index) in documentosFiltrados" :key="index">
                    <td>{{ pago.fecha }}</td>
                    <td>{{ pago.proveedor }}</td>
                    <td>{{ formatCurrency(pago.total) }}</td>
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
              <button class="btn btn-danger" @click="cancelarAbono">Cancelar</button>
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
      listaProveedores: [
        { nombre: 'Proveedor 1' },
        { nombre: 'Proveedor 2' },
        { nombre: 'Proveedor 3' },
      ],
      proveedorSeleccionado: null,
      documentos: [
        { fecha: '2025-01-01', proveedor: 'Proveedor 1', total: 100000 },
        { fecha: '2025-01-02', proveedor: 'Proveedor 2', total: 200000 },
        { fecha: '2025-01-03', proveedor: 'Proveedor 3', total: 300000 },
      ],
      historialAbonos: [
        { total: 100000, abono: 20000, saldoPendiente: 80000, fechaPago: '2025-01-05' },
        { total: 200000, abono: 50000, saldoPendiente: 150000, fechaPago: '2025-01-06' },
        { total: 300000, abono: 100000, saldoPendiente: 200000, fechaPago: '2025-01-07' },
      ],
      nuevoAbono: 0,
    };
  },
  computed: {
    documentosFiltrados() {
      return this.documentos.filter(
        (doc) => this.proveedorSeleccionado && doc.proveedor === this.proveedorSeleccionado.nombre
      );
    },
    historialAbonosFiltrados() {
      return this.historialAbonos.filter(
        (abono) =>
          this.proveedorSeleccionado &&
          this.documentosFiltrados.some((doc) => doc.total === abono.total)
      );
    },
  },
  methods: {
    seleccionarProveedor(proveedor) {
      this.proveedorSeleccionado = proveedor;
    },
    calcularSaldoPendiente() {
      if (!this.proveedorSeleccionado) return 0;

      const documento = this.documentosFiltrados[0];
      if (!documento) return 0;

      const totalAbonos = this.historialAbonosFiltrados.reduce((sum, abono) => sum + abono.abono, 0);
      return documento.total - totalAbonos - this.nuevoAbono;
    },
    guardarAbono() {
      if (!this.proveedorSeleccionado || this.nuevoAbono <= 0) return;

      const documento = this.documentosFiltrados[0];
      if (!documento) return;

      this.historialAbonos.push({
        total: documento.total,
        abono: this.nuevoAbono,
        saldoPendiente: this.calcularSaldoPendiente(),
        fechaPago: new Date().toISOString().split('T')[0],
      });

      this.nuevoAbono = 0;
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    },
    cancelarAbono() {
      this.nuevoAbono = 0;
    },
  },
};
</script>

<style scoped>
.card-header {
  font-size: 1.5rem;
}
button {
  min-width: 100px;
}
</style>
