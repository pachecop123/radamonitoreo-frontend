<template>
  <div class="custom-container mt-3">
    <div class="card shadow">
      <div class="card-header text-center bg-primary text-white">
        <h3>Gestión de clientes</h3>
      </div>

      <div class="card-body">
        <button class="btn btn-success mb-3" @click="openModal">
          Crear Nuevo Cliente
        </button>
        <input type="text" v-model="searchQuery" class="form-control mb-4 shadow-sm" placeholder="Buscar cliente..." />

        <div class="mt-4">
          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead class="bg-light">
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(cliente, index) in filteredClientes" :key="cliente.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ cliente.nombre }}</td>
                  <td>{{ cliente.correo }}</td>
                  <td>{{ cliente.telefono }}</td>
                  <td>{{ cliente.direccion }}</td>
                  <td>
                    <button class="btn btn-warning btn-sm" @click="editCliente(cliente)">Editar</button>
                    <button class="btn btn-danger btn-sm" @click="deleteCliente(cliente.id)">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>


    <!-- Modal para crear/editar clientes -->
    <div class="modal fade" id="clienteModal" tabindex="-1" aria-labelledby="clienteModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="clienteModalLabel">{{ isEditing ? 'Editar Cliente' : 'Crear Cliente' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
              @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="isEditing ? updateCliente() : createCliente()">
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input v-model="clienteData.nombre" type="text" class="form-control" id="nombre" required />
              </div>
              <div class="mb-3">
                <label for="correo" class="form-label">Correo</label>
                <input v-model="clienteData.correo" type="email" class="form-control" id="correo" required />
              </div>
              <div class="mb-3">
                <label for="telefono" class="form-label">Teléfono</label>
                <input v-model="clienteData.telefono" type="text" class="form-control" id="telefono" required />
              </div>
              <div class="mb-3">
                <label for="direccion" class="form-label">Dirección</label>
                <input v-model="clienteData.direccion" type="text" class="form-control" id="direccion" required />
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
  name: 'Clientes',
  data() {
    return {
      clientes: [
        { id: 1, nombre: 'Juan Pérez', correo: 'juan.perez@example.com', telefono: '555-1234', direccion: 'Av. Siempre Viva 123' },
        { id: 2, nombre: 'María Gómez', correo: 'maria.gomez@example.com', telefono: '555-5678', direccion: 'Calle Falsa 456' },
        { id: 3, nombre: 'Carlos Ramírez', correo: 'carlos.ramirez@example.com', telefono: '555-8765', direccion: 'Boulevard de los Sueños 789' },
        { id: 4, nombre: 'Ana Torres', correo: 'ana.torres@example.com', telefono: '555-4321', direccion: 'Camino Real 101' },
        { id: 5, nombre: 'Luis Méndez', correo: 'luis.mendez@example.com', telefono: '555-6789', direccion: 'Plaza Mayor 202' }
      ],
      clienteData: {
        nombre: '',
        correo: '',
        telefono: '',
        direccion: ''
      },
      isEditing: false,
      currentClienteId: null,
      searchQuery: ''
    };
  },
  computed: {
    filteredClientes() {
      if (!this.searchQuery) {
        return this.clientes;
      }
      return this.clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        cliente.correo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        cliente.telefono.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        cliente.direccion.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    openModal() {
      this.resetClienteData();
      this.isEditing = false;
      const modalElement = document.getElementById('clienteModal');
      const modal = new Modal(modalElement);
      modal.show();
    },
    resetClienteData() {
      this.clienteData = {
        nombre: '',
        correo: '',
        telefono: '',
        direccion: ''
      };
    },
    async createCliente() {
      try {
        const newCliente = { ...this.clienteData, id: Date.now() }; // Simulación de creación de cliente
        this.clientes.push(newCliente);
        this.closeModal();
        Swal.fire('Éxito', 'Cliente creado con éxito', 'success');
      } catch (error) {
        console.error('Error creating cliente', error);
        Swal.fire('Error', 'No se pudo crear el cliente', 'error');
      }
    },
    editCliente(cliente) {
      this.clienteData = { ...cliente };
      this.isEditing = true;
      this.currentClienteId = cliente.id;
      const modalElement = document.getElementById('clienteModal');
      const modal = new Modal(modalElement);
      modal.show();
    },
    async updateCliente() {
      try {
        const index = this.clientes.findIndex(c => c.id === this.currentClienteId);
        this.clientes[index] = { ...this.clienteData, id: this.currentClienteId };
        this.closeModal();
        Swal.fire('Éxito', 'Cliente actualizado con éxito', 'success');
      } catch (error) {
        console.error('Error updating cliente', error);
        Swal.fire('Error', 'No se pudo actualizar el cliente', 'error');
      }
    },
    async deleteCliente(id) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás recuperar este cliente después de eliminarlo.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        try {
          this.clientes = this.clientes.filter(c => c.id !== id);
          Swal.fire('Eliminado!', 'El cliente ha sido eliminado.', 'success');
        } catch (error) {
          console.error('Error deleting cliente', error);
          Swal.fire('Error', 'No se pudo eliminar el cliente', 'error');
        }
      }
    },
    closeModal() {
      const modalElement = document.getElementById('clienteModal');
      const modal = Modal.getInstance(modalElement);
      modal.hide();
    }
  }
};
</script>

<style scoped>
.custom-container {
  max-width: 1400px;
  /* Ajusta el tamaño máximo según tus necesidades */
  margin: 0 auto;
  /* Centra el contenedor horizontalmente */
}

.card-header {
  font-size: 1.5rem;
}

button {
  min-width: 80px;
}
</style>