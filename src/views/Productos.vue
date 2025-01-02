<template>
  <div class="container mt-3">
    <div class="card shadow">
      <div class="card-header text-center bg-primary text-white">
        <h3>Gestión de Productos</h3>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <!-- Información del Producto -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="nombre" class="form-label">Nombre del Producto</label>
              <input type="text" id="nombre" class="form-control" v-model="producto.nombre" required />
            </div>
            <div class="col-md-6">
              <label for="precioCompra" class="form-label">Precio de Compra</label>
              <input type="number" id="precioCompra" class="form-control" v-model="producto.precioCompra" @input="calcularPrecios" required />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="margenGanancia" class="form-label">Margen de Ganancia (%)</label>
              <input type="number" id="margenGanancia" class="form-control" v-model="producto.margenGanancia" @input="calcularPrecios" required />
            </div>
            <div class="col-md-6">
              <label for="precioVenta" class="form-label">Precio de Venta</label>
              <input type="number" id="precioVenta" class="form-control" v-model="producto.precioVenta" readonly />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-3">
              <label for="iva" class="form-label">% IVA</label>
              <input type="number" id="iva" class="form-control" v-model="producto.iva" @input="calcularPrecios" required />
            </div>
            <div class="col-md-3">
              <label for="precioVentaTotal" class="form-label">Precio de Venta Total</label>
              <input type="number" id="precioVentaTotal" class="form-control" v-model="producto.precioVentaTotal" readonly />
            </div>
            <div class="col-md-6">
              <label for="imagen" class="form-label">Imagen del Producto</label>
              <input type="file" id="imagen" class="form-control" @change="handleImageUpload" />
              <img :src="producto.imagenUrl" alt="Imagen del producto" class="img-fluid mt-3" v-if="producto.imagenUrl" />
            </div>
          </div>
          <!-- Radio Buttons para IVA -->
          <div class="row mb-3">
            <div class="col-md-12">
              <label class="form-label">IVA</label>
              <div class="form-check">
                <input type="radio" class="form-check-input" id="incluidoIVA" value="incluido" v-model="producto.tipoIVA" @change="calcularPrecios" />
                <label class="form-check-label" for="incluidoIVA">Incluido IVA</label>
              </div>
              <div class="form-check">
                <input type="radio" class="form-check-input" id="incluirIVA" value="incluir" v-model="producto.tipoIVA" @change="calcularPrecios" />
                <label class="form-check-label" for="incluirIVA">Incluir IVA</label>
              </div>
              <div class="form-check">
                <input type="radio" class="form-check-input" id="sinIVA" value="sin" v-model="producto.tipoIVA" @change="calcularPrecios" />
                <label class="form-check-label" for="sinIVA">Sin IVA</label>
              </div>
            </div>
          </div>
          <!-- Botón de Agregar -->
          <div class="row mb-3">
            <div class="col-md-12 text-end">
              <button type="submit" class="btn btn-primary">{{ editMode ? 'Actualizar Producto' : 'Agregar Producto' }}</button>
            </div>
          </div>
        </form>
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

<script>
export default {
  data() {
    return {
      producto: {
        nombre: '',
        precioCompra: 0,
        margenGanancia: 0,
        precioVenta: 0,
        iva: 0,
        precioVentaTotal: 0,
        imagenUrl: '',
        tipoIVA: 'sin', // Valores posibles: 'incluido', 'incluir', 'sin'
      },
      productos: [],
      editMode: false,
      editIndex: -1,
    };
  },
  methods: {
    calcularPrecios() {
      const precioVenta = this.producto.precioCompra * (1 + this.producto.margenGanancia / 100);
      let precioVentaTotal = precioVenta;

      if (this.producto.tipoIVA === 'incluir') {
        precioVentaTotal = precioVenta * (1 + this.producto.iva / 100);
      } else if (this.producto.tipoIVA === 'incluido') {
        precioVentaTotal = precioVenta / (1 + this.producto.iva / 100);
      }

      this.producto.precioVenta = precioVenta;
      this.producto.precioVentaTotal = precioVentaTotal;
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          this.producto.imagenUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    handleSubmit() {
      if (this.editMode) {
        this.productos.splice(this.editIndex, 1, { ...this.producto });
        this.editMode = false;
        this.editIndex = -1;
      } else {
        this.productos.push({ ...this.producto });
      }
      this.limpiarFormulario();
    },
    limpiarFormulario() {
      this.producto = {
        nombre: '',
        precioCompra: 0,
        margenGanancia: 0,
        precioVenta: 0,
        iva: 0,
        precioVentaTotal: 0,
        imagenUrl: '',
        tipoIVA: 'sin',
      };
    },
    editProduct(index) {
      this.producto = { ...this.productos[index] };
      this.editMode = true;
      this.editIndex = index;
    },
    deleteProduct(index) {
      this.productos.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.card-header {
  font-size: 1.5rem;
}
button {
  min-width: 120px;
}
</style>