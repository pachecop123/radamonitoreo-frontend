<template>
  <div class="container mt-3">
    <div class="card shadow">
      <div class="card-header text-center bg-primary text-white">
        <h3>Compras</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <!-- Fecha -->
          <div class="col-md-3 mb-3">
            <label for="fecha" class="form-label">Fecha</label>
            <input type="date" id="fecha" class="form-control" v-model="form.fecha" />
          </div>

          <!-- Información del Producto -->
          <div class="col-md-9 d-flex align-items-center justify-content-between">
            <div>

            </div>
            <div class="d-flex justify-content-end">
              <img v-if="selectedProducto.imagen" :src="selectedProducto.imagen" alt="Imagen del producto" class="img-fluid" width="100"/>
            </div>
          </div>
        </div>

        <!-- Proveedor -->
        <div class="row">
          <div class="col-md-3">
            <label for="proveedor" class="form-label">Proveedor</label>
            <select id="proveedor" class="form-select" v-model="form.proveedor" @change="cargarProveedor">
              <option v-for="prov in proveedores" :key="prov.id" :value="prov.nombre">{{ prov.nombre }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <label for="razonSocial" class="form-label">Razón Social</label>
            <input type="text" id="razonSocial" class="form-control" v-model="form.razonSocial" readonly/>
          </div>
          <div class="col-md-3">
            <label for="rut" class="form-label">RUT/RUC/DNI</label>
            <input type="text" id="rut" class="form-control" v-model="form.rut" readonly/>
          </div>
          <div class="col-md-3">
            <label for="celular" class="form-label">Celular</label>
            <input type="text" id="celular" class="form-control" v-model="form.celular" readonly/>
          </div>
        </div>

        <div class="row mt-3">
          <div class="col-md-12">
            <label for="direccion" class="form-label">Dirección</label>
            <input id="direccion" class="form-control" v-model="form.direccion" readonly/>
          </div>
        </div>

        <!-- Productos -->
        <div class="mt-4">
          <h5 class="text-center">Productos</h5>
          <div class="row">
            <div class="col-md-6">
              <label for="producto" class="form-label">Producto</label>
              <select id="producto" class="form-select" v-model="form.productoSeleccionado" @change="cargarProducto">
                <option v-for="producto in productos" :key="producto.id" :value="producto.nombre">{{ producto.nombre }}</option>
              </select>
            </div>
            <div class="col-md-2">
              <label for="precio" class="form-label">Precio</label>
              <input type="number" id="precio" class="form-control" v-model="form.precio" readonly/>
            </div>
            <div class="col-md-2">
              <label for="cantidad" class="form-label">Cantidad</label>
              <input type="number" id="cantidad" class="form-control" v-model="form.cantidad" />
            </div>
            <div class="col-md-2 d-flex align-items-end">
              <button class="btn btn-primary w-100" @click="agregarProducto">
                <i class="fas fa-cart-plus"></i> Agregar
              </button>
            </div>
          </div>
        </div>

        <!-- Lista de productos -->
        <div class="table-responsive mt-4">
          <table class="table table-bordered">
            <thead class="bg-light">
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cant.</th>
                <th>Subt.</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in carrito" :key="index">
                <td>{{ item.nombre }}</td>
                <td>{{ formatCurrency(item.precio) }}</td>
                <td>{{ item.cantidad }}</td>
                <td>{{ formatCurrency(item.subtotal) }}</td>
                <td>
                  <button class="btn btn-danger btn-sm" @click="eliminarProducto(index)">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Total -->
        <div class="text-end mt-3">
          <h5>Total: {{ formatCurrency(total) }}</h5>
        </div>

        <!-- Botones -->
        <div class="d-flex justify-content-between mt-4">
          <div>
            <label class="form-check-label me-3">
              <input type="radio" v-model="form.metodoPago" value="Transferencia" /> Transferencia
            </label>
            <label class="form-check-label me-3">
              <input type="radio" v-model="form.metodoPago" value="Efectivo" /> Efectivo
            </label>
            <label class="form-check-label">
              <input type="radio" v-model="form.metodoPago" value="Crédito" /> Crédito
            </label>
          </div>
          <div>
            <button class="btn btn-success me-2" @click="registrar">
              <i class="fas fa-save"></i> Registrar
            </button>
            <button class="btn btn-secondary me-2" @click="limpiar">
              <i class="fas fa-broom"></i> Limpiar
            </button>
            <button class="btn btn-danger" @click="cancelar">
              <i class="fas fa-trash"></i> Cancelar
            </button>
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
      form: {
        fecha: "",
        proveedor: "",
        razonSocial: "",
        rut: "",
        celular: "",
        direccion: "",
        productoSeleccionado: "",
        precio: 0,
        cantidad: 0,
        metodoPago: "",
      },
      productos: [
        { id: 1, nombre: "Producto A", precio: 100, imagen: "https://image.made-in-china.com/202f0j00UEuCWTaITPqe/Great-Will-Wired-GPS-Tracker-4G-Vehicle-GPS-Car-Tracking-Device-Real-Time-Location-Tracking-Hardwired-GPS-Tracker-Locator.webp" },
        { id: 2, nombre: "Producto B", precio: 200, imagen: "https://via.placeholder.com/150?text=Producto+B" },
      ],
      proveedores: [
        { id: 1, nombre: "Proveedor X", razonSocial: "Razon Social X", rut: "123456789", celular: "987654321", direccion: "Calle Ficticia 123" },
        { id: 2, nombre: "Proveedor Y", razonSocial: "Razon Social Y", rut: "987654321", celular: "123456789", direccion: "Avenida Ejemplo 456" },
      ],
      carrito: [],
      selectedProducto: {},
    };
  },
  computed: {
    total() {
      return this.carrito.reduce((acc, item) => acc + item.subtotal, 0);
    },
    unidad() {
      return "Und"; // Puedes ajustar según la lógica
    },
  },
  methods: {
    agregarProducto() {
      if (this.form.productoSeleccionado && this.form.precio > 0 && this.form.cantidad > 0) {
        const subtotal = this.form.precio * this.form.cantidad;
        this.carrito.push({
          nombre: this.form.productoSeleccionado,
          precio: this.form.precio,
          cantidad: this.form.cantidad,
          subtotal,
        });
        this.form.precio = 0;
        this.form.cantidad = 0;
      }
    },
    eliminarProducto(index) {
      this.carrito.splice(index, 1);
    },
    cargarProveedor() {
      const proveedor = this.proveedores.find(p => p.nombre === this.form.proveedor);
      if (proveedor) {
        this.form.razonSocial = proveedor.razonSocial;
        this.form.rut = proveedor.rut;
        this.form.celular = proveedor.celular;
        this.form.direccion = proveedor.direccion;
      }
    },
    cargarProducto() {
      const producto = this.productos.find(p => p.nombre === this.form.productoSeleccionado);
      if (producto) {
        this.form.precio = producto.precio;
        this.selectedProducto = producto;
      }
    },
    registrar() {
      alert("Datos guardados correctamente");
    },
    limpiar() {
      this.form = {
        fecha: "",
        proveedor: "",
        razonSocial: "",
        rut: "",
        celular: "",
        direccion: "",
        productoSeleccionado: "",
        precio: 0,
        cantidad: 0,
        metodoPago: "",
      };
      this.carrito = [];
      this.selectedProducto = {}; // Reset selectedProducto to clear the image
    },
    cancelar() {
      alert("Datos eliminados correctamente");
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
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