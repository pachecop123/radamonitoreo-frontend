<template>
  <div class="custom-container mt-3">
    <div class="card shadow">
      <div class="card-header text-center bg-primary text-white">
        <h3>Gestión de Compras</h3>
      </div>
      <div class="card-body">
        <button class="btn btn-success mb-3" @click="openModal">
          Crear Compra
        </button>

        <input
          type="text"
          v-model="searchQuery"
          class="form-control mb-4 shadow-sm"
          placeholder="Buscar compra..."
        />

        <!-- Tabla de Compras -->
        <div class="mt-4">
          <div class="btn-group mb-3" role="group">
            <button type="button" class="btn btn-outline-primary" @click="filtro = 'hoy'">Hoy</button>
            <button type="button" class="btn btn-outline-primary" @click="filtro = 'semana'">Esta Semana</button>
            <button type="button" class="btn btn-outline-primary" @click="filtro = '15dias'">Últimos 15 Días</button>
            <button type="button" class="btn btn-outline-primary" @click="filtro = 'todos'">Todos</button>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead class="bg-light">
                <tr>
                  <th>Fecha</th>
                  <th>Proveedor</th>
                  <th>Razón Social</th>
                  <th>RUT/RUC/DNI</th>
                  <th>Celular</th>
                  <th>Dirección</th>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Valor</th>
                  <th>Método de Pago</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(c, index) in filtrarCompras()" :key="index">
                  <td>{{ c.fecha }}</td>
                  <td>{{ c.proveedor }}</td>
                  <td>{{ c.razonSocial }}</td>
                  <td>{{ c.rut }}</td>
                  <td>{{ c.celular }}</td>
                  <td>{{ c.direccion }}</td>
                  <td>{{ c.producto }}</td>
                  <td>{{ formatCurrency(c.precio) }}</td>
                  <td>{{ c.cantidad }}</td>
                  <td>{{ formatCurrency(c.valor) }}</td>
                  <td>{{ c.metodoPago }}</td>
                  <td>
                    <button class="btn btn-sm btn-warning me-2" @click="editCompra(index)">Editar</button>
                    <button class="btn btn-sm btn-danger" @click="deleteCompra(index)">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para crear/editar compras -->
    <div class="modal fade" id="compraModal" tabindex="-1" aria-labelledby="compraModalLabel" aria-hidden="true" ref="compraModal">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="compraModalLabel">{{ isEditing ? 'Editar Compra' : 'Crear Compra' }}</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="isEditing ? updateCompra() : createCompra()">
              <div class="mb-3">
                <label for="fecha" class="form-label">Fecha</label>
                <input v-model="compraData.fecha" type="date" class="form-control" id="fecha" required />
              </div>
              <div class="mb-3">
                <label for="proveedor" class="form-label">Proveedor</label>
                <select v-model="compraData.proveedor" id="proveedor" class="form-select" @change="loadProveedorDetails" required>
                  <option v-for="prov in proveedores" :key="prov.id" :value="prov.nombre">{{ prov.nombre }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="razonSocial" class="form-label">Razón Social</label>
                <input v-model="compraData.razonSocial" type="text" class="form-control" id="razonSocial" readonly />
              </div>
              <div class="mb-3">
                <label for="rut" class="form-label">RUT/RUC/DNI</label>
                <input v-model="compraData.rut" type="text" class="form-control" id="rut" readonly />
              </div>
              <div class="mb-3">
                <label for="celular" class="form-label">Celular</label>
                <input v-model="compraData.celular" type="text" class="form-control" id="celular" readonly />
              </div>
              <div class="mb-3">
                <label for="direccion" class="form-label">Dirección</label>
                <input v-model="compraData.direccion" type="text" class="form-control" id="direccion" readonly />
              </div>
              <div class="mb-3">
                <label for="producto" class="form-label">Producto</label>
                <input v-model="compraData.producto" type="text" class="form-control" id="producto" required />
              </div>
              <div class="mb-3">
                <label for="precio" class="form-label">Precio</label>
                <input v-model="compraData.precio" @input="formatInput" type="text" class="form-control" id="precio" required />
              </div>
              <div class="mb-3">
                <label for="cantidad" class="form-label">Cantidad</label>
                <input v-model="compraData.cantidad" type="number" class="form-control" id="cantidad" required />
              </div>
              <div class="mb-3">
                <label for="metodoPago" class="form-label">Método de Pago</label>
                <div class="form-check">
                  <input class="form-check-input" type="radio" v-model="compraData.metodoPago" value="Transferencia" id="transferencia" required />
                  <label class="form-check-label" for="transferencia">Transferencia</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" v-model="compraData.metodoPago" value="Efectivo" id="efectivo" required />
                  <label class="form-check-label" for="efectivo">Efectivo</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" v-model="compraData.metodoPago" value="Crédito" id="credito" required />
                  <label class="form-check-label" for="credito">Crédito</label>
                </div>
              </div>
              <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar' : 'Crear' }}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';

export default {
  data() {
    return {
      compraData: {
        fecha: '',
        proveedor: '',
        razonSocial: '',
        rut: '',
        celular: '',
        direccion: '',
        producto: '',
        precio: 0,
        cantidad: 0,
        metodoPago: ''
      },
      compras: [],
      proveedores: [
        { id: 1, nombre: 'Proveedor 1', razonSocial: 'Razón Social 1', rut: '123456789', celular: '987654321', direccion: 'Calle 1' },
        { id: 2, nombre: 'Proveedor 2', razonSocial: 'Razón Social 2', rut: '987654321', celular: '123456789', direccion: 'Calle 2' }
      ],
      isEditing: false,
      currentCompraIndex: null,
      filtro: 'todos'
    };
  },
  methods: {
    openModal() {
      this.resetCompraData();
      this.isEditing = false;
      if (this.compraModalInstance) {
        this.compraModalInstance.show();
      } else {
        this.compraModalInstance = new Modal(this.$refs.compraModal);
        this.compraModalInstance.show();
      }
    },
    resetCompraData() {
      this.compraData = {
        fecha: '',
        proveedor: '',
        razonSocial: '',
        rut: '',
        celular: '',
        direccion: '',
        producto: '',
        precio: 0,
        cantidad: 0,
        metodoPago: ''
      };
    },
    async createCompra() {
      try {
        const newCompra = { ...this.compraData, id: Date.now() }; // Simulación de creación de compra
        newCompra.valor = this.unformatCurrency(newCompra.precio) * newCompra.cantidad; // Calcular el valor antes de guardar
        this.compras.push(newCompra);
        this.closeModal();
        Swal.fire('Éxito', 'Compra creada con éxito', 'success');
      } catch (error) {
        console.error('Error creating compra', error);
        Swal.fire('Error', 'No se pudo crear la compra', 'error');
      }
    },
    editCompra(index) {
      this.compraData = { ...this.compras[index] };
      this.isEditing = true;
      this.currentCompraIndex = index;
      if (this.compraModalInstance) {
        this.compraModalInstance.show();
      } else {
        this.compraModalInstance = new Modal(this.$refs.compraModal);
        this.compraModalInstance.show();
      }
    },
    async updateCompra() {
      try {
        this.compraData.valor = this.unformatCurrency(this.compraData.precio) * this.compraData.cantidad; // Calcular el valor antes de guardar
        this.compras.splice(this.currentCompraIndex, 1, { ...this.compraData });
        this.closeModal();
        Swal.fire('Éxito', 'Compra actualizada con éxito', 'success');
      } catch (error) {
        console.error('Error updating compra', error);
        Swal.fire('Error', 'No se pudo actualizar la compra', 'error');
      }
    },
    async deleteCompra(index) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás recuperar esta compra después de eliminarla.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        try {
          this.compras.splice(index, 1);
          Swal.fire('Eliminado!', 'La compra ha sido eliminada.', 'success');
        } catch (error) {
          console.error('Error deleting compra', error);
          Swal.fire('Error', 'No se pudo eliminar la compra', 'error');
        }
      }
    },
    closeModal() {
      if (this.compraModalInstance) {
        this.compraModalInstance.hide();
      }
    },
    filtrarCompras() {
      const hoy = new Date().toISOString().split('T')[0];
      const unaSemanaAntes = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];
      const quinceDiasAntes = new Date(new Date().setDate(new Date().getDate() - 15)).toISOString().split('T')[0];

      if (this.filtro === 'hoy') {
        return this.compras.filter(c => c.fecha === hoy);
      } else if (this.filtro === 'semana') {
        return this.compras.filter(c => c.fecha >= unaSemanaAntes && c.fecha <= hoy);
      } else if (this.filtro === '15dias') {
        return this.compras.filter(c => c.fecha >= quinceDiasAntes && c.fecha <= hoy);
      } else {
        return this.compras;
      }
    },
    formatCurrency(value) {
      if (typeof value === 'string') {
        value = value.replace(/\D/g, '');
      }
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    },
    unformatCurrency(value) {
      return value.replace(/\D/g, '');
    },
    formatInput(event) {
      const value = event.target.value;
      this.compraData.precio = this.formatCurrency(value);
    },
    loadProveedorDetails() {
      const proveedor = this.proveedores.find(p => p.nombre === this.compraData.proveedor);
      if (proveedor) {
        this.compraData.razonSocial = proveedor.razonSocial;
        this.compraData.rut = proveedor.rut;
        this.compraData.celular = proveedor.celular;
        this.compraData.direccion = proveedor.direccion;
      }
    }
  },
  mounted() {
    this.compraModalInstance = new Modal(this.$refs.compraModal);
  }
};
</script>

<style scoped>
.custom-container {
  max-width: 1400px; /* Ajusta el tamaño máximo según tus necesidades */
  margin: 0 auto; /* Centra el contenedor horizontalmente */
}
.card-header {
  font-size: 1.5rem;
}
button {
  min-width: 80px;
}
#descripcion {
  height: 100px; /* Ajusta esta altura según tus necesidades */
  word-wrap: break-word; /* Agrega esta propiedad para que se ajuste el texto */
  white-space: pre-wrap; /* Agrega esta propiedad para que se ajuste el texto */
}
</style>