<template>
  <div class="container mt-4">
    <!-- Header -->
    <div class="text-center mb-4">
      <h3>INVENTARIOS</h3>
    </div>

    <!-- Summary Section -->
    <div class="d-flex justify-content-between mb-3">
      <!-- Cards on the left -->
      <div class="d-flex justify-content-start">
        <div class="card text-center me-3" style="width: 200px; background-color: #28a745; color: white;">
          <div class="card-body">
            <h5 class="card-title">Numero de Productos</h5>
            <p class="card-text">{{ selectedProduct ? selectedProduct.stock : totalProducts }}</p>
          </div>
        </div>
        <div class="card text-center" style="width: 200px; background-color: #dc3545; color: white;">
          <div class="card-body">
            <h5 class="card-title">Valor Inv. Compras</h5>
            <p class="card-text">{{ selectedProduct ? selectedProduct.purchasePrice * selectedProduct.stock : totalInventoryValue }}</p>
          </div>
        </div>
      </div>

      <!-- Product image on the right -->
      <div class="card text-center" style="width: 150px; height: 150px;">
  <div class="card-body d-flex flex-column align-items-center justify-content-center">
    <div
    
    >
      <img
        v-if="selectedProduct"
        :src="selectedProduct.image"
        alt="Imagen del producto"
        style="max-width: 100%; max-height: 100%; object-fit: contain;"
          </div>
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="mb-3">
      <input
        type="text"
        v-model="searchQuery"
        class="form-control"
        placeholder="Nombre Producto"
      />
    </div>

    <!-- Table -->
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead class="table-primary">
          <tr>
            <th>Nombre del Producto</th>
            <th>Precio Compra</th>
            <th>Margen Ganancia</th>
            <th>Precio de Venta</th>
            <th>Inventario Inicial</th>
            <th>Entradas</th>
            <th>Salidas</th>
            <th>Existencias</th>
            <th>Stock Ideal</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in filteredProducts"
            :key="product.id"
            @click="selectProduct(product)"
            style="cursor: pointer;"
          >
            <td>{{ product.name }}</td>
            <td>{{ product.purchasePrice }}</td>
            <td>{{ product.profitMargin }}%</td>
            <td>{{ product.salePrice }}</td>
            <td>{{ product.initialStock }}</td>
            <td>{{ product.entries }}</td>
            <td>{{ product.outputs }}</td>
            <td>{{ product.stock }}</td>
            <td>{{ product.idealStock }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      selectedProduct: null,
      products: [
        // Ejemplo de datos iniciales
        {
          id: 1,
          name: "Producto 1",
          purchasePrice: 100,
          profitMargin: 20,
          salePrice: 120,
          initialStock: 50,
          entries: 10,
          outputs: 5,
          stock: 55,
          idealStock: 60,
          image: "https://image.made-in-china.com/202f0j00UEuCWTaITPqe/Great-Will-Wired-GPS-Tracker-4G-Vehicle-GPS-Car-Tracking-Device-Real-Time-Location-Tracking-Hardwired-GPS-Tracker-Locator.webp",
        },
        {
          id: 2,
          name: "Producto 2",
          purchasePrice: 150,
          profitMargin: 25,
          salePrice: 187.5,
          initialStock: 30,
          entries: 20,
          outputs: 10,
          stock: 40,
          idealStock: 50,
          image: "https://via.placeholder.com/150",
        },
        // Agregar más productos si es necesario
      ],
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter((product) =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    totalProducts() {
      return this.products.reduce((total, product) => total + product.stock, 0);
    },
    totalInventoryValue() {
      return this.products.reduce(
        (total, product) => total + product.purchasePrice * product.stock,
        0
      );
    },
  },
  methods: {
    selectProduct(product) {
      this.selectedProduct = product;
    },
  },
};
</script>

<style>
.card {
  transition: transform 0.2s;
}
.card:hover {
  transform: scale(1.02);
}
.table {
  text-align: center;
  font-size: 14px;
}
</style>
