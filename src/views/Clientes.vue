<template>
    <div class="container">
      <h1 class="mt-4">Gestión de Clientes</h1>
  
      <!-- Botón para abrir el modal -->
      <b-button variant="primary" class="mb-4" @click="openModal">Agregar Cliente</b-button>
  
      <!-- Modal para crear/actualizar cliente -->
      <b-modal id="cliente-modal" ref="clienteModal" title="Cliente" @hide="resetForm">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="nombre" class="form-label">Nombre</label>
            <input type="text" class="form-control" id="nombre" v-model="cliente.nombre" required />
          </div>
          <div class="mb-3">
            <label for="correo" class="form-label">Correo</label>
            <input type="email" class="form-control" id="correo" v-model="cliente.correo" required />
          </div>
          <div class="mb-3">
            <label for="telefono" class="form-label">Teléfono</label>
            <input type="text" class="form-control" id="telefono" v-model="cliente.telefono" required />
          </div>
          <div class="mb-3">
            <label for="direccion" class="form-label">Dirección</label>
            <input type="text" class="form-control" id="direccion" v-model="cliente.direccion" required />
          </div>
          <b-button type="submit" variant="primary">{{ isEditing ? 'Actualizar' : 'Crear' }} Cliente</b-button>
          <b-button variant="secondary" @click="closeModal">Cancelar</b-button>
        </form>
      </b-modal>
  
      <!-- Lista de clientes -->
      <h2 class="mt-4">Lista de Clientes</h2>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cliente in clientes" :key="cliente.id">
            <td>{{ cliente.nombre }}</td>
            <td>{{ cliente.correo }}</td>
            <td>{{ cliente.telefono }}</td>
            <td>{{ cliente.direccion }}</td>
            <td>
              <b-button variant="warning" size="sm" @click="editCliente(cliente)">Editar</b-button>
              <b-button variant="danger" size="sm" @click="deleteCliente(cliente.id)">Eliminar</b-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import Swal from 'sweetalert2';
  
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
        cliente: {
          id: null,
          nombre: '',
          correo: '',
          telefono: '',
          direccion: ''
        },
        isEditing: false
      };
    },
    methods: {
      openModal() {
        this.$refs.clienteModal.show();
      },
      closeModal() {
        this.$refs.clienteModal.hide();
      },
      handleSubmit() {
        if (this.isEditing) {
          this.updateCliente();
        } else {
          this.createCliente();
        }
      },
      createCliente() {
        const newCliente = { ...this.cliente, id: this.clientes.length + 1 };
        this.clientes.push(newCliente);
        this.closeModal();
        this.resetForm();
        Swal.fire('Éxito', 'Cliente creado con éxito', 'success');
      },
      updateCliente() {
        const index = this.clientes.findIndex(c => c.id === this.cliente.id);
        this.$set(this.clientes, index, { ...this.cliente });
        this.closeModal();
        this.resetForm();
        Swal.fire('Éxito', 'Cliente actualizado con éxito', 'success');
      },
      deleteCliente(id) {
        this.clientes = this.clientes.filter(c => c.id !== id);
        Swal.fire('Éxito', 'Cliente eliminado con éxito', 'success');
      },
      editCliente(cliente) {
        this.cliente = { ...cliente };
        this.isEditing = true;
        this.openModal();
      },
      resetForm() {
        this.cliente = {
          id: null,
          nombre: '',
          correo: '',
          telefono: '',
          direccion: ''
        };
        this.isEditing = false;
      }
    }
  };
  </script>
  
  <style scoped>
  /* Estilos específicos para este componente */
  </style>