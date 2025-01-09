<template>
  <div class="custom-container mt-3">
    <div class="card shadow">
      <div class="card-header text-center bg-primary text-white">
        <h3>Gestión de Gastos</h3>
      </div>
      <div class="card-body">
        <button class="btn btn-success mb-3" @click="openModal">
          Crear Nuevo Gasto
        </button>

        <input
      type="text"
      v-model="searchQuery"
      class="form-control mb-4 shadow-sm"
      placeholder="Buscar gasto..."
    />

        <!-- Tabla de Gastos -->
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
                  <th>Tipo de Gasto</th>
                  <th>Descripción</th>
                  <th>Valor</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(g, index) in filtrarGastos()" :key="index">
                  <td>{{ g.fecha }}</td>
                  <td>{{ g.tipo }}</td>
                  <td>{{ g.descripcion }}</td>
                  <td>{{ formatCurrency(g.valor) }}</td>
                  <td>
                    <button class="btn btn-sm btn-warning me-2" @click="editGasto(index)">Editar</button>
                    <button class="btn btn-sm btn-danger" @click="deleteGasto(index)">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para crear/editar gastos -->
    <div class="modal fade" id="gastoModal" tabindex="-1" aria-labelledby="gastoModalLabel" aria-hidden="true" ref="gastoModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="gastoModalLabel">{{ isEditing ? 'Editar Gasto' : 'Crear Gasto' }}</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="isEditing ? updateGasto() : createGasto()">
              <div class="mb-3">
                <label for="fecha" class="form-label">Fecha</label>
                <input v-model="gastoData.fecha" type="date" class="form-control" id="fecha" required />
              </div>
              <div class="mb-3">
                <label for="tipo" class="form-label">Tipo de Gasto</label>
                <select v-model="gastoData.tipo" id="tipo" class="form-select" required>
                  <option value="">Seleccione un tipo</option>
                  <option value="administrativos">Administrativos</option>
                  <option value="operativos">Operativos</option>
                  <option value="no operativos">No Operativos</option>
                  <option value="ventas">Ventas</option>
                  <option value="otros">Otros</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="descripcion" class="form-label">Descripción</label>
                <textarea v-model="gastoData.descripcion" class="form-control" id="descripcion" rows="4" required></textarea>
              </div>
              <div class="mb-3">
                <label for="valor" class="form-label">Valor</label>
                <input v-model="gastoData.valor" @input="formatInput" type="text" class="form-control" id="valor" required />
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
      gastoData: {
        fecha: '',
        tipo: '',
        descripcion: '',
        valor: 0
      },
      gastos: [],
      isEditing: false,
      currentGastoIndex: null,
      filtro: 'todos'
    };
  },
  methods: {
    openModal() {
      this.resetGastoData();
      this.isEditing = false;
      if (this.gastoModalInstance) {
        this.gastoModalInstance.show();
      } else {
        this.gastoModalInstance = new Modal(this.$refs.gastoModal);
        this.gastoModalInstance.show();
      }
    },
    resetGastoData() {
      this.gastoData = {
        fecha: '',
        tipo: '',
        descripcion: '',
        valor: 0
      };
    },
    async createGasto() {
      try {
        const newGasto = { ...this.gastoData, id: Date.now() }; // Simulación de creación de gasto
        newGasto.valor = this.unformatCurrency(newGasto.valor); // Desformatear el valor antes de guardar
        this.gastos.push(newGasto);
        this.closeModal();
        Swal.fire('Éxito', 'Gasto creado con éxito', 'success');
      } catch (error) {
        console.error('Error creating gasto', error);
        Swal.fire('Error', 'No se pudo crear el gasto', 'error');
      }
    },
    editGasto(index) {
      this.gastoData = { ...this.gastos[index] };
      this.isEditing = true;
      this.currentGastoIndex = index;
      if (this.gastoModalInstance) {
        this.gastoModalInstance.show();
      } else {
        this.gastoModalInstance = new Modal(this.$refs.gastoModal);
        this.gastoModalInstance.show();
      }
    },
    async updateGasto() {
      try {
        this.gastoData.valor = this.unformatCurrency(this.gastoData.valor); // Desformatear el valor antes de guardar
        this.gastos.splice(this.currentGastoIndex, 1, { ...this.gastoData });
        this.closeModal();
        Swal.fire('Éxito', 'Gasto actualizado con éxito', 'success');
      } catch (error) {
        console.error('Error updating gasto', error);
        Swal.fire('Error', 'No se pudo actualizar el gasto', 'error');
      }
    },
    async deleteGasto(index) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás recuperar este gasto después de eliminarlo.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        try {
          this.gastos.splice(index, 1);
          Swal.fire('Eliminado!', 'El gasto ha sido eliminado.', 'success');
        } catch (error) {
          console.error('Error deleting gasto', error);
          Swal.fire('Error', 'No se pudo eliminar el gasto', 'error');
        }
      }
    },
    closeModal() {
      if (this.gastoModalInstance) {
        this.gastoModalInstance.hide();
      }
    },
    filtrarGastos() {
      const hoy = new Date().toISOString().split('T')[0];
      const unaSemanaAntes = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];
      const quinceDiasAntes = new Date(new Date().setDate(new Date().getDate() - 15)).toISOString().split('T')[0];

      if (this.filtro === 'hoy') {
        return this.gastos.filter(g => g.fecha === hoy);
      } else if (this.filtro === 'semana') {
        return this.gastos.filter(g => g.fecha >= unaSemanaAntes && g.fecha <= hoy);
      } else if (this.filtro === '15dias') {
        return this.gastos.filter(g => g.fecha >= quinceDiasAntes && g.fecha <= hoy);
      } else {
        return this.gastos;
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
      this.gastoData.valor = this.formatCurrency(value);
    }
  },
  mounted() {
    this.gastoModalInstance = new Modal(this.$refs.gastoModal);
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