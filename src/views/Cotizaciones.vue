<template>
  <div class="container mt-3">
    <div class="card shadow">
      <div class="card-header text-center bg-primary text-white">
        <h3>Cotizaciones</h3>
      </div>
      <div class="card-body">
        <!-- Información general -->
        <div class="row">
          <!-- Fecha -->
          <div class="col-md-3 mb-3">
            <label for="fecha" class="form-label">Fecha</label>
            <input type="date" id="fecha" class="form-control" v-model="venta.fecha" />
          </div>

          <div class="col-md-3 d-flex justify-content-end align-items-center">
            <img v-if="selectedProduct.imagen" :src="selectedProduct.imagen" alt="Imagen del producto" class="img-fluid" width="100" style="max-width: 200px; max-height: 200px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);" />
          </div>
        </div>
        <!-- Información del Cliente -->
        <div class="row">
          <div class="col-md-6">
            <label for="cliente" class="form-label">Cliente</label>
            <select id="cliente" class="form-select" v-model="selectedClient" @change="loadClientDetails">
              <option v-for="client in clientes" :key="client.id" :value="client">{{ client.nombre }}</option>
            </select>
          </div>
          <div class="col-md-6">
            <label for="razonSocial" class="form-label">Razón Social</label>
            <input type="text" id="razonSocial" class="form-control" v-model="venta.razonSocial" readonly />
          </div>
        </div>
        <div class="row">
          <div class="col-md-3">
            <label for="nit" class="form-label">NIT</label>
            <input type="text" id="nit" class="form-control" v-model="venta.nit" readonly />
          </div>
          <div class="col-md-3">
            <label for="celular" class="form-label">Celular</label>
            <input type="text" id="celular" class="form-control" v-model="venta.celular" readonly />
          </div>
          <div class="col-md-6">
            <label for="direccion" class="form-label">Dirección</label>
            <input type="text" id="direccion" class="form-control" v-model="venta.direccion" readonly />
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-md-6">
            <label for="producto" class="form-label">Producto</label>
            <select id="producto" class="form-select" v-model="selectedProduct" @change="updateProductDetails">
              <option v-for="product in productos" :key="product.id" :value="product">{{ product.nombre }}</option>
            </select>
          </div>
        </div>
        <!-- Detalles del Producto -->
        <div class="row mt-3">
          <div class="col-md-3">
            <label for="precio" class="form-label">Precio</label>
            <input type="number" id="precio" class="form-control" v-model="venta.precio" readonly />
          </div>
          <div class="col-md-3">
            <label for="cantidad" class="form-label">Cantidad</label>
            <input type="number" id="cantidad" class="form-control" v-model="venta.cantidad" />
          </div>
          <div class="col-md-3">
            <label for="iva" class="form-label">% IVA</label>
            <input type="number" id="iva" class="form-control" v-model="venta.iva" />
          </div>
          <div class="col-md-3">
            <label for="descuento" class="form-label">% Descuento</label>
            <input type="number" id="descuento" class="form-control" v-model="venta.descuento" />
          </div>
        </div>
        <!-- Agregar Producto -->
        <div class="row mt-3">
          <div class="col-md-12 text-end">
            <button type="button" class="btn btn-success" @click="agregarProducto">
              <i class="fas fa-cart-plus"></i> Agregar Producto
            </button>
          </div>
        </div>
        <!-- Lista de Productos -->
        <div class="table-responsive mt-4">
          <table class="table table-bordered table-hover">
            <thead class="bg-light">
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Descuento</th>
                <th>IVA</th>
                <th>Subtotal</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in venta.productos" :key="index">
                <td>{{ product.nombre }}</td>
                <td>{{ product.precio }}</td>
                <td>{{ product.cantidad }}</td>
                <td>{{ product.descuento }}%</td>
                <td>{{ product.iva }}%</td>
                <td>{{ product.subtotal.toFixed(2) }}</td>
                <td>
                  <button class="btn btn-danger btn-sm" @click="eliminarProducto(index)">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Subtotal y Total -->
        <div class="row mt-3">
          <div class="col-md-6">
            <label for="subtotal" class="form-label">Subtotal</label>
            <input type="number" id="subtotal" class="form-control" v-model="venta.subtotal" readonly />
          </div>
          <div class="col-md-6">
            <label for="total" class="form-label">Total</label>
            <input type="number" id="total" class="form-control" v-model="venta.total" readonly />
          </div>
        </div>
        <!-- Métodos de Pago -->
        <div class="row mt-4">
          <div class="col-md-12">
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" v-model="venta.tipoVenta" value="efectivo" />
              <label class="form-check-label">Efectivo</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" v-model="venta.tipoVenta" value="transferencia" />
              <label class="form-check-label">Transferencia</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" v-model="venta.tipoVenta" value="credito" />
              <label class="form-check-label">Crédito</label>
            </div>
          </div>
        </div>
        <!-- Botones de Acción -->
        <div class="row mt-4">
          <div class="col-md-12 text-end">
            <button class="btn btn-success me-2" @click="registrar">
              <i class="fas fa-save"></i> Registrar
            </button>
            <button class="btn btn-secondary me-2" @click="limpiarFormulario">
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
      venta: {
        fecha: '',
        vendedor: '',
        cliente: '',
        razonSocial: '',
        nit: '',
        celular: '',
        direccion: '',
        precio: 0,
        cantidad: 0,
        iva: 0,
        descuento: 0,
        subtotal: 0,
        total: 0,
        tipoVenta: 'efectivo',
        productos: []
      },
      selectedProduct: {},
      selectedClient: {},
      productos: [
        { id: 1, nombre: 'Producto 1', imagen: 'https://image.made-in-china.com/202f0j00UEuCWTaITPqe/Great-Will-Wired-GPS-Tracker-4G-Vehicle-GPS-Car-Tracking-Device-Real-Time-Location-Tracking-Hardwired-GPS-Tracker-Locator.webp', precio: 100 },
        { id: 2, nombre: 'Producto 2', imagen: 'https://via.placeholder.com/200', precio: 200 },
        // Agrega más productos según necesites
      ],
      clientes: [
        { id: 1, nombre: 'Cliente 1', razonSocial: 'Empresa 1', nit: '123456789', celular: '987654321', direccion: 'Calle 1' },
        { id: 2, nombre: 'Cliente 2', razonSocial: 'Empresa 2', nit: '987654321', celular: '123456789', direccion: 'Calle 2' },
        // Agrega más clientes según necesites
      ]
    };
  },
  methods: {
    handleSubmit() {
      // Lógica para manejar la presentación del formulario
      console.log('Formulario enviado', this.venta);
    },
    limpiarFormulario() {
      this.venta = {
        fecha: '',
        vendedor: '',
        cliente: '',
        razonSocial: '',
        nit: '',
        celular: '',
        direccion: '',
        precio: 0,
        cantidad: 0,
        iva: 0,
        descuento: 0,
        subtotal: 0,
        total: 0,
        tipoVenta: 'efectivo',
        productos: []
      };
      this.selectedProduct = {};
      this.selectedClient = {};
    },
    buscarVenta() {
      // Lógica para buscar una venta
      console.log('Buscar venta');
    },
    eliminarVenta() {
      // Lógica para eliminar una venta
      console.log('Eliminar venta');
    },
    updateProductDetails() {
      if (this.selectedProduct) {
        this.venta.precio = this.selectedProduct.precio;
        this.calculateTotals();
      }
    },
    agregarProducto() {
      if (this.selectedProduct && this.venta.cantidad > 0) {
        const producto = {
          ...this.selectedProduct,
          cantidad: this.venta.cantidad,
          descuento: this.venta.descuento,
          iva: this.venta.iva,
          subtotal: this.calculateSubtotal(this.selectedProduct.precio, this.venta.cantidad, this.venta.descuento, this.venta.iva)
        };
        this.venta.productos.push(producto);
        this.calculateTotals();
        this.limpiarProducto();
      }
    },
    eliminarProducto(index) {
      this.venta.productos.splice(index, 1);
      this.calculateTotals();
    },
    calculateSubtotal(precio, cantidad, descuento, iva) {
      const descuentoTotal = (precio * descuento) / 100;
      const precioConDescuento = precio - descuentoTotal;
      const subtotalSinIva = precioConDescuento * cantidad;
      const ivaTotal = (subtotalSinIva * iva) / 100;
      return subtotalSinIva + ivaTotal;
    },
    limpiarProducto() {
      this.selectedProduct = {};
      this.venta.precio = 0;
      this.venta.cantidad = 0;
      this.venta.iva = 0;
      this.venta.descuento = 0;
    },
    calculateTotals() {
      let total = 0;
      let subtotal = 0;
      this.venta.productos.forEach(product => {
        const descuentoTotal = (product.precio * product.descuento) / 100;
        const precioConDescuento = product.precio - descuentoTotal;
        const subtotalSinIva = precioConDescuento * product.cantidad;
        const ivaTotal = (subtotalSinIva * product.iva) / 100;
        subtotal += subtotalSinIva;
        total += subtotalSinIva + ivaTotal;
        product.subtotal = subtotalSinIva + ivaTotal;
      });
      this.venta.subtotal = subtotal;
      this.venta.total = total;
    },
    loadClientDetails() {
      if (this.selectedClient) {
        this.venta.razonSocial = this.selectedClient.razonSocial;
        this.venta.nit = this.selectedClient.nit;
        this.venta.celular = this.selectedClient.celular;
        this.venta.direccion = this.selectedClient.direccion;
      }
    }
  }
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