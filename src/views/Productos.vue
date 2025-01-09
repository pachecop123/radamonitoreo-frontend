<template>
  <div class="container mt-3">
    <div class="card shadow">
      <div class="card-header text-center bg-primary text-white">
        <h3>Gestión de Productos</h3>
      </div>
      <div class="card-body">
        <button class="btn btn-success mb-3" @click="openModal">
          Crear Producto
        </button>

        <!-- Tabla de Productos -->
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
                  <th>Nombre del Producto</th>
                  <th>Precio de Compra</th>
                  <th>Precio de Venta</th>
                  <th>% IVA</th>
                  <th>Precio de Venta + IVA</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(prod, index) in productos" :key="index">
                  <td>{{ prod.nombre }}</td>
                  <td>{{ prod.precioCompra }}</td>
                  <td>{{ prod.precioVenta.toFixed(2) }}</td>
                  <td>{{ prod.iva }}%</td>
                  <td>{{ prod.precioVentaTotal.toFixed(2) }}</td>
                  <td>
                    <button class="btn btn-sm btn-warning me-2" @click="editProduct(index)">Editar</button>
                    <button class="btn btn-sm btn-danger" @click="deleteProduct(index)">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal para crear/editar productos -->
    <div v-if="isModalOpen" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5);">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Crear Producto</h5>
            <button type="button" class="btn-close p-0" @click="resetFormData"></button>
          </div>
          <div class="modal-body">
            <div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="nombre" class="form-label">Nombre del Producto</label>
                  <input v-model="formData.name" type="text" id="nombre" class="form-control" />
                  <template v-if="errors.name.length > 0">
                    <b :key="e" v-for="e in errors.name" class="text-danger">
                      {{ e }}
                    </b>
                  </template>
                </div>
                <div class="col-md-6">
                  <label for="descripcion" class="form-label">Descripción del Producto</label>
                  <input v-model="formData.description" type="text" id="descripcion" class="form-control" />
                  <template v-if="errors.description.length > 0">
                    <b :key="e" v-for="e in errors.description" class="text-danger">
                      {{ e }}
                    </b>
                  </template>
                </div>
              </div>
              <!-- Imagen y stock -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="imagen" class="form-label">Imagen del Producto</label>
                  <input type="file" id="imagen" class="form-control" @change="handleImageUpload" />
                  <img :src="formData.image" alt="Imagen del producto" class="img-fluid mt-3" v-if="formData.image" />
                  <template v-if="errors.image.length > 0">
                    <b :key="e" v-for="e in errors.image" class="text-danger">
                      {{ e }}
                    </b>
                  </template>
                </div>
                <div class="col-md-6">
                  <label for="stock" class="form-label">Stock</label>
                  <input v-model="formData.stock" type="number" id="stock" class="form-control mb-3" />
                  <template v-if="errors.stock.length > 0">
                    <b :key="e" v-for="e in errors.stock" class="text-danger">
                      {{ e }}
                    </b>
                  </template>
                </div>
              </div>
              <!-- Precio de compra y margen de ganancia -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="precioCompra" class="form-label">Precio de Compra</label>
                  <input v-model="formData.purchase_price" type="number" id="precioCompra" class="form-control" />
                  <template v-if="errors.purchase_price.length > 0">
                    <b :key="e" v-for="e in errors.purchase_price" class="text-danger">
                      {{ e }}
                    </b>
                  </template>
                </div>
                <div class="col-md-6">
                  <label for="margenGanancia" class="form-label">Margen de Ganancia (%)</label>
                  <input v-model="formData.profit_margin" type="number" id="margenGanancia" class="form-control" />
                  <template v-if="errors.profit_margin.length > 0">
                    <b :key="e" v-for="e in errors.profit_margin" class="text-danger">
                      {{ e }}
                    </b>
                  </template>
                </div>
              </div>
              <!-- Precio de venta, IVA y precio total -->
              <div class="row mb-3">
                <div class="col-md-4">
                  <label for="precioVenta" class="form-label">Precio de Venta</label>
                  <input v-model="formData.sale_price" type="number" id="precioVenta" class="form-control"/>
                  <template v-if="errors.sale_price.length > 0">
                    <b :key="e" v-for="e in errors.sale_price" class="text-danger">
                      {{ e }}
                    </b>
                  </template>
                </div>
                <div class="col-md-4">
                  <label for="iva" class="form-label">% IVA</label>
                  <input v-model="formData.vat" type="number" id="iva" class="form-control" />
                  <template v-if="errors.vat.length > 0">
                    <b :key="e" v-for="e in errors.vat" class="text-danger">
                      {{ e }}
                    </b>
                  </template>
                </div>
                <div class="col-md-4">
                  <label for="precioVentaTotal" class="form-label">Precio Total</label>
                  <input v-model="formData.total_sale_price" type="number" id="precioVentaTotal" class="form-control" />
                  <template v-if="errors.total_sale_price.length > 0">
                    <b :key="e" v-for="e in errors.total_sale_price" class="text-danger">
                      {{ e }}
                    </b>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary me-lg-auto" @click="resetFormData">Cerrar</button>
            <button type="button" class="btn btn-primary" @click="saveProduct">Crear Producto</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isModalOpen = ref(false);
const isEditing = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const formData = ref({
  name: '',
  description: '',
  purchase_price: '',
  profit_margin: '',
  sale_price: '',
  vat: '',
  total_sale_price: '',
  image: '',
  stock: '',
})

const errors = ref({
  name: [],
  description: [],
  purchase_price: [],
  profit_margin: [],
  sale_price: [],
  vat: [],
  total_sale_price: [],
  image: [],
  stock: [],
})

const errorsClear = () => {
  errors.value = {
    name: [],
    description: [],
    purchase_price: [],
    profit_margin: [],
    sale_price: [],
    vat: [],
    total_sale_price: [],
    image: [],
    stock: [],
  }
}

const resetFormData = () => {
  formData.value = {
    name: '',
    description: '',
    purchase_price: '',
    profit_margin: '',
    sale_price: '',
    vat: '',
    total_sale_price: '',
    image: '',
    stock: '',
  }
  errorsClear()
  isModalOpen.value = false
  isEditing.value = false
}


//   methods: {
//     calcularPrecios() {
//       const precioVenta = this.producto.precioCompra * (1 + this.producto.margenGanancia / 100);
//       let precioVentaTotal = precioVenta;

//       if (this.producto.tipoIVA === 'incluir') {
//         precioVentaTotal = precioVenta * (1 + this.producto.iva / 100);
//       } else if (this.producto.tipoIVA === 'incluido') {
//         precioVentaTotal = precioVenta / (1 + this.producto.iva / 100);
//       }

//       this.producto.precioVenta = precioVenta;
//       this.producto.precioVentaTotal = precioVentaTotal;
//     },
//     handleImageUpload(event) {
//       const file = event.target.files[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = e => {
//           this.producto.imagenUrl = e.target.result;
//         };
//         reader.readAsDataURL(file);
//       }
//     },
//     handleSubmit() {
//       if (this.editMode) {
//         this.productos.splice(this.editIndex, 1, { ...this.producto });
//         this.editMode = false;
//         this.editIndex = -1;
//       } else {
//         this.productos.push({ ...this.producto });
//       }
//       this.limpiarFormulario();
//     },
//     limpiarFormulario() {
//       this.producto = {
//         nombre: '',
//         precioCompra: 0,
//         margenGanancia: 0,
//         precioVenta: 0,
//         iva: 0,
//         precioVentaTotal: 0,
//         imagenUrl: '',
//         tipoIVA: 'sin',
//       };
//     },
//     editProduct(index) {
//       this.producto = { ...this.productos[index] };
//       this.editMode = true;
//       this.editIndex = index;
//     },
//     deleteProduct(index) {
//       this.productos.splice(index, 1);
//     },
// };
</script>

<style scoped>
.card-header {
  font-size: 1.5rem;
}

button {
  min-width: 120px;
}

.modal.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>