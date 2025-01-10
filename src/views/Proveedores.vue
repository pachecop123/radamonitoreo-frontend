<template>
  <div class="custom-container mt-3">
    <div class="card shadow">
      <div class="card-header text-center bg-primary text-white">
        <h3>Gestión de Proveedores</h3>
      </div>
      <div class="card-body">
        <button class="btn btn-success mb-3" @click="openModal">
          Crear Proveedor
        </button>

        <input
          type="text"
          v-model="searchQuery"
          class="form-control mb-4 shadow-sm"
          placeholder="Buscar proveedor..."
        />

        <!-- Tabla de Proveedores -->
        <div class="mt-4">
          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead class="bg-light">
                <tr>
                  <th>Nombre</th>
                  <th>Razón Social</th>
                  <th>RUT/RUC/DNI</th>
                  <th>Celular</th>
                  <th>Dirección</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(p, index) in filtrarProveedores()" :key="index">
                  <td>{{ p.nombre }}</td>
                  <td>{{ p.razonSocial }}</td>
                  <td>{{ p.rut }}</td>
                  <td>{{ p.celular }}</td>
                  <td>{{ p.direccion }}</td>
                  <td>
                    <button class="btn btn-sm btn-warning me-2" @click="editProveedor(index)">Editar</button>
                    <button class="btn btn-sm btn-danger" @click="deleteProveedor(index)">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para crear/editar proveedores -->
    <div class="modal fade" id="proveedorModal" tabindex="-1" aria-labelledby="proveedorModalLabel" aria-hidden="true" ref="proveedorModal">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="proveedorModalLabel">{{ isEditing ? 'Editar Proveedor' : 'Crear Proveedor' }}</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="isEditing ? updateProveedor() : createProveedor()">
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input v-model="proveedorData.nombre" type="text" class="form-control" id="nombre" required />
              </div>
              <div class="mb-3">
                <label for="razonSocial" class="form-label">Razón Social</label>
                <input v-model="proveedorData.razonSocial" type="text" class="form-control" id="razonSocial" required />
              </div>
              <div class="mb-3">
                <label for="rut" class="form-label">RUT/RUC/DNI</label>
                <input v-model="proveedorData.rut" type="text" class="form-control" id="rut" required />
              </div>
              <div class="mb-3">
                <label for="celular" class="form-label">Celular</label>
                <input v-model="proveedorData.celular" type="text" class="form-control" id="celular" required />
              </div>
              <div class="mb-3">
                <label for="direccion" class="form-label">Dirección</label>
                <input v-model="proveedorData.direccion" type="text" class="form-control" id="direccion" required />
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
      proveedorData: {
        nombre: '',
        razonSocial: '',
        rut: '',
        celular: '',
        direccion: ''
      },
      proveedores: [],
      isEditing: false,
      currentProveedorIndex: null,
      searchQuery: ''
    };
  },
  methods: {
    openModal() {
      this.resetProveedorData();
      this.isEditing = false;
      if (this.proveedorModalInstance) {
        this.proveedorModalInstance.show();
      } else {
        this.proveedorModalInstance = new Modal(this.$refs.proveedorModal);
        this.proveedorModalInstance.show();
      }
    },
    resetProveedorData() {
      this.proveedorData = {
        nombre: '',
        razonSocial: '',
        rut: '',
        celular: '',
        direccion: ''
      };
    },
    async createProveedor() {
      try {
        const newProveedor = { ...this.proveedorData, id: Date.now() }; // Simulación de creación de proveedor
        this.proveedores.push(newProveedor);
        this.closeModal();
        Swal.fire('Éxito', 'Proveedor creado con éxito', 'success');
      } catch (error) {
        console.error('Error creating proveedor', error);
        Swal.fire('Error', 'No se pudo crear el proveedor', 'error');
      }
    },
    editProveedor(index) {
      this.proveedorData = { ...this.proveedores[index] };
      this.isEditing = true;
      this.currentProveedorIndex = index;
      if (this.proveedorModalInstance) {
        this.proveedorModalInstance.show();
      } else {
        this.proveedorModalInstance = new Modal(this.$refs.proveedorModal);
        this.proveedorModalInstance.show();
      }
    },
    async updateProveedor() {
      try {
        this.proveedores.splice(this.currentProveedorIndex, 1, { ...this.proveedorData });
        this.closeModal();
        Swal.fire('Éxito', 'Proveedor actualizado con éxito', 'success');
      } catch (error) {
        console.error('Error updating proveedor', error);
        Swal.fire('Error', 'No se pudo actualizar el proveedor', 'error');
      }
    },
    async deleteProveedor(index) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás recuperar este proveedor después de eliminarlo.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        try {
          this.proveedores.splice(index, 1);
          Swal.fire('Eliminado!', 'El proveedor ha sido eliminado.', 'success');
        } catch (error) {
          console.error('Error deleting proveedor', error);
          Swal.fire('Error', 'No se pudo eliminar el proveedor', 'error');
        }
      }
    },
    closeModal() {
      if (this.proveedorModalInstance) {
        this.proveedorModalInstance.hide();
      }
    },
    filtrarProveedores() {
      if (!this.searchQuery) {
        return this.proveedores;
      }
      const lowerSearchQuery = this.searchQuery.toLowerCase();
      return this.proveedores.filter(p =>
        p.nombre.toLowerCase().includes(lowerSearchQuery) ||
        p.razonSocial.toLowerCase().includes(lowerSearchQuery) ||
        p.rut.toLowerCase().includes(lowerSearchQuery) ||
        p.celular.toLowerCase().includes(lowerSearchQuery) ||
        p.direccion.toLowerCase().includes(lowerSearchQuery)
      );
    }
  },
  mounted() {
    this.proveedorModalInstance = new Modal(this.$refs.proveedorModal);
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
</style>