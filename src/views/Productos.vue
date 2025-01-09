<template>
  <div class="container mt-3">
    <div class="card shadow">
      <div class="card-header text-center bg-primary text-white">
        <h3>Gestión de Productos</h3>
      </div>
      <div class="card-body">
          <!-- Información del Producto -->
          <div class="row mb-3">
            <!-- Nombre y Descripción -->
            <div class="col-md-6">
              <label for="nombre" class="form-label">Nombre del Producto</label>
              <input type="text" id="nombre" class="form-control" v-model="formData.name" required />
            </div>
            <div class="col-md-6">
              <label for="descripcion" class="form-label">Descripción del Producto</label>
              <input type="text" id="descripcion" class="form-control" v-model="formData.description" required />
            </div>
          </div>
        
          <div class="row mb-3">
            <!-- Imagen del Producto -->
            <div class="col-md-6">
              <label for="imagen" class="form-label">Imagen del Producto</label>
              <input type="file" id="imagen" class="form-control" @change="handleImageUpload" />
              <img :src="formData.image" alt="Imagen del producto" class="img-fluid mt-3" v-if="formData.image" />
            </div>
          
            <!-- Stock del Producto -->
            <div class="col-md-6 d-flex flex-column justify-content-between">
              <label for="stock" class="form-label">Stock</label>
              <input type="number" id="stock" class="form-control mb-3" v-model="formData.stock" required />
            </div>
          </div>

          <div class="row mb-3">
            <!-- Precio de Compra y Margen de Ganancia -->
            <div class="col-md-6">
              <label for="precioCompra" class="form-label">Precio de Compra</label>
              <input type="number" id="precioCompra" class="form-control" v-model="formData.purchase_price" @input="calcularPrecios" required />
            </div>
            <div class="col-md-6">
              <label for="margenGanancia" class="form-label">Margen de Ganancia (%)</label>
              <input type="number" id="margenGanancia" class="form-control" v-model="formData.profit_margin" @input="calcularPrecios" required />
            </div>
          </div>
        
          <div class="row mb-3">
            <!-- Precio de Venta, IVA y Precio Total -->
            <div class="col-md-4">
              <label for="precioVenta" class="form-label">Precio de Venta</label>
              <input type="number" id="precioVenta" class="form-control" v-model="formData.sale_price" readonly />
            </div>
            <div class="col-md-4">
              <label for="iva" class="form-label">% IVA</label>
              <input type="number" id="iva" class="form-control" v-model="formData.vat" @input="calcularPrecios" required />
            </div>
            <div class="col-md-4">
              <label for="precioVentaTotal" class="form-label">Precio de Venta Total</label>
              <input type="number" id="precioVentaTotal" class="form-control" v-model="formData.total_sale_price" readonly />
            </div>
          </div>
        
          <!-- Botón de Agregar -->
          <div class="row mb-3">
            <div class="col-md-12 text-end">
              <button type="submit" class="btn btn-primary">
                {{ editMode ? 'Actualizar Producto' : 'Agregar Producto' }}
              </button>
            </div>
        </div>
        
        <!-- Tabla de Productos -->
        <div class="table-responsive mt-4">
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
</template>

<script setup>
import { ref } from 'vue';


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
</style>