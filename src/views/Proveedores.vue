<template>
  <div class="custom-container mt-3">
    <div class="card shadow">
      <div class="card-header text-center bg-primary text-white">
        <h3>Gestión de Proveedores</h3>
      </div>
      <div class="card-body">
        <input type="text" v-model="searchQuery" class="form-control mb-4 shadow-sm"
          placeholder="Buscar proveedor..." />

        <button class="btn btn-success mb-4" @click="openCreateModal">
          Crear Proveedor
        </button>

        <!-- Tabla de Proveedores -->
        <div class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead class="bg-light">
              <tr>
                <th>#</th>
                <th>RUT/DNI</th>
                <th>Razón Social</th>
                <th>Nombre</th>
                <th>Celular</th>
                <th>Correo</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!suppliers.length">
                <td colspan="6">No se encontraro proveedores</td>
              </tr>
              <tr v-else v-for="(supplier, index) in suppliers" :key="supplier.id">
                <td>{{ calculateIndex(index) }}</td>
                <td>{{ supplier.rut }}</td>
                <td>{{ supplier.company_name }}</td>
                <td>{{ supplier.name }}</td>
                <td>{{ supplier.phone }}</td>
                <td>{{ supplier.email }}</td>
                <td>{{ supplier.address }}</td>
                <td>
                  <button class="btn btn-sm btn-warning" @click="openEditModal(supplier)">Editar</button>
                  <button class="btn btn-sm btn-danger" @click="deleteSupplier(supplier.id)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination d-flex align-items-center justify-content-center mt-3">
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
            Anterior
          </button>
          <span>Página {{ currentPage }} de {{ totalPages }}</span>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  </div>

    <!-- Modal -->
  <div class="modal fade" id="supplierModal" tabindex="-1" aria-labelledby="supplierModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="supplierModalLabel">{{ showEditForm ? 'Editar Proveedor' : 'Crear Proveedor' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="showEditForm ? updateSupplier() : createSupplier()">
            <div class="form-group">
              <label for="rut" class="form-label">RUT</label>
              <input v-model="form.rut" type="text" class="form-control" required />
            </div>
            <div class="form-group">
              <label for="company_name" class="form-label">Razón Social</label>
              <input v-model="form.company_name" type="text" class="form-control" required />
            </div>
            <div class="form-group">
              <label for="name" class="form-label">Nombre</label>
              <input v-model="form.name" type="text" class="form-control" required />
            </div>
            <div class="form-group">
              <label for="phone" class="form-label">Celular</label>
              <input v-model="form.phone" type="text" class="form-control" required />
            </div>
            <div class="form-group">
              <label for="email" class="form-label">Correo</label>
              <input v-model="form.email" type="email" class="form-control" required />
            </div>
            <div class="form-group">
              <label for="address" class="form-label">Dirección</label>
              <input v-model="form.address" type="text" class="form-control" required />
            </div>
            <div class=" d-flex justify-content-between mt-4">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-success">{{ showEditForm ? 'Actualizar' : 'Crear' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useApi } from "@/composables/use-api";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";


const suppliers = ref([]);
const searchQuery = ref("");
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = 5;
const showCreateForm = ref(false);
const showEditForm = ref(false);
const form = ref({
  rut: "",
  company_name: "",
  name: "",
  email: "",
  phone: "",
  address: "",
});

const fetchSuppliers = async (page = 1, search = "") => {
  try {
    const response = await useApi(`supplier?page=${page}&search=${search}`);
    suppliers.value = response.suppliers.data;
    currentPage.value = response.suppliers.current_page;
    totalPages.value = response.suppliers.last_page;
  } catch (error) {
    console.error("Error al obtener los proveedores", error);
  }
};

const createSupplier = async () => {
  try {
    await useApi("supplier", "POST", form.value);
    fetchSuppliers(currentPage.value);
    cancelForm();
    Swal.fire("Éxito", "Proveedro creado exitosamente", "success");
  } catch (error) {
    console.error("Error al crear el proveedor:", error);
    Swal.fire("Error", "No se pudo crear el proveedor", "error");
  }
};

const openEditModal = (supplier) => {
  form.value = { ...supplier };
  showEditForm.value = true;
  showCreateForm.value = false;
  new bootstrap.Modal(document.getElementById("supplierModal")).show();
};

const updateSupplier = async () => {
  try {
    await useApi(`supplier/${form.value.id}`, "PUT", form.value);
    fetchSuppliers(currentPage.value);
    cancelForm();
    Swal.fire("Proveedor actualizado", "El proveedor ha sido actualizado exitosamente", "success");
  } catch (error) {
    console.error("Error al actualizar el proveedor", error);
    Swal.fire("Error", "No se pudo actualizar el proveedor", "error");
  }
};

const deleteSupplier = (id) => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás revertir esto",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await useApi(`supplier/${id}`, "DELETE");
        fetchSuppliers(currentPage.value);
        Swal.fire("Eliminado", "Proveedor eliminado exitosamente", "success");
      } catch (error) {
        console.error("Error al eliminar el proveedor", error);
        Swal.fire("Error", "No se pudo eliminar el proveedor", "error");
      }
    }
  });
};

const cancelForm = () => {
  form.value = {
    rut: "",
    company_name: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  };
  showCreateForm.value = false;
  showEditForm.value = false;
  const modalElement = document.getElementById("supplierModal");
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  if (modalInstance) {
    modalInstance.hide();
  }
};

const openCreateModal = () => {
  cancelForm();
  showCreateForm.value = true;
  showEditForm.value = false;
  new bootstrap.Modal(document.getElementById("supplierModal")).show();
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchSuppliers(page, searchQuery.value);
  }
};

const calculateIndex = (index) => {
  return (currentPage.value - 1) * itemsPerPage + index + 1;
};

onMounted(() => {
  fetchSuppliers();
});

watch(searchQuery, (newQuery) => {
  fetchSuppliers(1, newQuery);
});

</script>




<style scoped>
.custom-container {
  max-width: 1400px;
  margin: 0 auto;
}

.card-header {
  font-size: 1.5rem;
}

.pagination button {
  background-color: #4e73df;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: bold;
  margin: 0 5px;
}

.pagination button:disabled {
  background-color: #e0e0e0;
  color: #7a7a7a;
}

.pagination span {
  font-weight: bold;
  color: #4e73df;
}
</style>