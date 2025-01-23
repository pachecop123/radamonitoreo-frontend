<template>
  <div class="container mt-3">
    <div class="card shadow">
      <div class="card-header text-center bg-primary text-white">
        <h3>Gestión de Productos</h3>
      </div>
      <div class="card-body">
        <input v-model="searchQuery" type="text" class="form-control mb-4 shadow-sm" placeholder="Buscar producto..." />
        <button class="btn btn-primary mb-3" @click="openCreateModal">Crear Producto</button>

        <!-- Tabla de Productos -->
        <div class="mt-4">
          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead class="bg-light">
                <tr>
                  <th>Imagen del Producto</th>
                  <th>Nombre del Producto</th>
                  <th>Precio de Compra</th>
                  <th>Margen de ganancia</th>
                  <th>Precio de Venta</th>
                  <th>Precio Venta + IVA</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in filteredData" :key="index">
                  <td>{{ row.image }}</td>
                  <td>{{ row.name }}</td>
                  <td>{{ row.purchase_price }}</td>
                  <td>{{ row.profit_margin }}</td>
                  <td>{{ row.sale_price }}</td>
                  <td>{{ row.total_sale_price }}</td>
                  <td>
                    <button class="btn btn-sm btn-warning me-2" @click="viewProduct(row)">Editar</button>
                    <button class="btn btn-sm btn-danger" @click="deleteProduct(row)">Eliminar</button>
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
    <!--MODAL CREAR PRODUCTOS -->
    <div v-if="isModalOpen" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5);">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Crear</h5>
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
                  <input type="file" id="imagen" class="form-control" @change="handleFileChange" />
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
                  <input :value="computedSalePrice" type="number" id="precioVenta" class="form-control" readonly />
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
                  <input :value="computedTotalSalePrice" type="number" id="precioVentaTotal" class="form-control"
                    readonly />
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

    <!-- MODAL EDITAR PRODUCTOS -->
    <div v-if="isEditModalOpen" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5);">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Producto</h5>
            <button type="button" class="btn-close p-0" @click="resetFormData"></button>
          </div>
          <div class="modal-body">
            <div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="editNombre" class="form-label">Nombre del Producto</label>
                  <input v-model="formData.name" type="text" id="editNombre" class="form-control" />
                  <template v-if="errors.name.length > 0">
                    <b :key="e" v-for="e in errors.name" class="text-danger">
                      {{ e }}
                    </b>
                  </template>
                </div>
                <div class="col-md-6">
                  <label for="editDescripcion" class="form-label">Descripción del Producto</label>
                  <input v-model="formData.description" type="text" id="editDescripcion" class="form-control" />
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
                  <label for="editImagen" class="form-label">Imagen del Producto</label>
                  <input type="file" id="editImagen" class="form-control" @change="handleFileChange" />
                  <img :src="formData.image" alt="Imagen del producto" class="img-fluid mt-3" v-if="formData.image" />
                  <template v-if="errors.image.length > 0">
                    <b :key="e" v-for="e in errors.image" class="text-danger">
                      {{ e }}
                    </b>
                  </template>
                </div>
                <div class="col-md-6">
                  <label for="editStock" class="form-label">Stock</label>
                  <input v-model="formData.stock" type="number" id="editStock" class="form-control mb-3" />
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
                  <label for="editPrecioCompra" class="form-label">Precio de Compra</label>
                  <input v-model="formData.purchase_price" type="number" id="editPrecioCompra" class="form-control" />
                  <template v-if="errors.purchase_price.length > 0">
                    <b :key="e" v-for="e in errors.purchase_price" class="text-danger">
                      {{ e }}
                    </b>
                  </template>
                </div>
                <div class="col-md-6">
                  <label for="editMargenGanancia" class="form-label">Margen de Ganancia (%)</label>
                  <input v-model="formData.profit_margin" type="number" id="editMargenGanancia" class="form-control" />
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
                  <label for="editPrecioVenta" class="form-label">Precio de Venta</label>
                  <input :value="computedSalePrice" type="number" id="editPrecioVenta" class="form-control" readonly />
                  <template v-if="errors.sale_price.length > 0">
                    <b :key="e" v-for="e in errors.sale_price" class="text-danger">
                      {{ e }}
                    </b>
                  </template>
                </div>
                <div class="col-md-4">
                  <label for="editIva" class="form-label">% IVA</label>
                  <input v-model="formData.vat" type="number" id="editIva" class="form-control" />
                  <template v-if="errors.vat.length > 0">
                    <b :key="e" v-for="e in errors.vat" class="text-danger">
                      {{ e }}
                    </b>
                  </template>
                </div>
                <div class="col-md-4">
                  <label for="editPrecioVentaTotal" class="form-label">Precio Total</label>
                  <input :value="computedTotalSalePrice" type="number" id="editPrecioVentaTotal" class="form-control"
                    readonly />
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
            <button type="button" class="btn btn-primary" @click="editProduct">Editar</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useApi } from '@/composables/use-api';
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';

const isModalOpen = ref(false);
const isEditModalOpen = ref(false);

onMounted(() => {
  dataTableApi();
});

const openCreateModal = () => {
  isModalOpen.value = true;
};

const searchQuery = ref('')
const tableData = ref([])

//BUSCADOR DE PRODUCTOS
const filteredData = computed(() => {
  console.log("Datos filtrados:", filteredData.value);

  const searchLower = searchQuery.value.toLowerCase();

  return tableData.value.filter((product) => {
    const name = product.name ? product.name.toLowerCase() : '';
    const description = product.description ? product.description.toLowerCase() : '';

    return name.includes(searchLower) || description.includes(searchLower);
  });
});

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
  isEditModalOpen.value = false
}

const discardButton = ref(null)

// CAMBIAR DE PAGINA
const currentPage = ref(1);
const totalPages = ref(1);
const perPage = 10;

const fetchProducts = async (page = 1) => {
  try {
    const response = await useApi(`product?page=${page}&per_page=${perPage}`);
    tableData.value = response.data;
    currentPage.value = response.current_page;
    totalPages.value = response.last_page;
  } catch (error) {
    console.log("Error al cargar datos:", error);
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchProducts(page);
  }
};

// Llama a la API cuando el componente se monta
onMounted(() => {
  fetchProducts();
});

//TABLA DE PRODUCTOS
const dataTableApi = async () => {
  try {
    const data = await useApi('product');
    console.log("Datos cargados desde API:", data);

    tableData.value = data.map((item) => ({
      id: item.id,
      image: item.image || '',
      name: item.name || '',
      description: item.description || '',
      purchase_price: item.purchase_price || 0,
      profit_margin: item.profit_margin || 0,
      sale_price: item.sale_price || 0,
      total_sale_price: item.total_sale_price || 0,
    }));
  } catch (error) {
    console.log('Error al cargar datos desde API:', error);
  }
};

//GUARDAR PRODUCTOS
const saveProduct = async () => {

  if (isNaN(parseFloat(formData.value.purchase_price)) || isNaN(parseFloat(formData.value.profit_margin))) {
    Swal.fire({
      title: 'Error',
      text: 'Por favor, ingresa valores válidos para Precio de Compra y Margen de Ganancia.',
      icon: 'error',
      confirmButtonText: 'Entendido'
    });
    return;
  }

  formData.value.sale_price = computedSalePrice.value;
  formData.value.total_sale_price = computedTotalSalePrice.value;

  errorsClear();

  let has_error = false;

  Object.entries(formData.value).forEach(f => {
    const elemento = f[0];
    const value = f[1];

    // Validar si el campo está vacío
    if (value === '' && (elemento !== 'image' || (elemento === 'image' && !formData.value.image))) {
      has_error = true;
      errors.value[elemento] = 'Este campo es obligatorio';
    }
  });

  if (has_error) {
    return;
  }

  try {
    await useApi("product", "POST", formData.value);
    Swal.fire({
      title: 'Éxito',
      text: 'Producto agregado con éxito',
      icon: 'success',
      confirmButtonText: '¡Entendido!'
    }).then(() => {
      if (discardButton.value) {
        discardButton.value.click();
      }
      resetFormData();
    });
  } catch (error) {
    const errors_api = error.errors;
    Object.entries(errors_api).forEach(e => {
      const elemento = e[0];
      const mensaje = e[1];
      errors.value[elemento] = mensaje;
    });
  }

  await dataTableApi();
  openCreateModal.value = false;
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.image = URL.createObjectURL(file);
  } else {
    formData.value.image = '';
  }
};

let id;
//VISUALIZAR PRODUCTOS EN EDICION
const viewProduct = async (user) => {
  try {
    const response = await useApi("product/" + user.id)

    console.log(response)

    if (response.message === "Product found") {
      id = user.id
      formData.value = {
        "name": response.data.name,
        "description": response.data.description,
        "purchase_price": response.data.purchase_price,
        "profit_margin": response.data.profit_margin,
        "sale_price": response.data.sale_price,
        "vat": response.data.vat,
        "total_sale_price": response.data.total_sale_price,
        "image": response.data.image,
        "stock": response.data.stock,
      }

      isEditModalOpen.value = true
    } else {
      console.log("Producto no encontrado")
    }
  } catch (error) {
    console.log("Error al obtener los datos del producto:", error)
  }
}

//EDITAR PRODUCTOS
const editProduct = async () => {
  try {
    const dataUpdated = {
      name: formData.value.name,
      description: formData.value.description,
      purchase_price: parseFloat(formData.value.purchase_price) || 0,
      profit_margin: parseFloat(formData.value.profit_margin) || 0,
      sale_price: computedSalePrice.value, // Precio de venta calculado
      vat: parseFloat(formData.value.vat) || 0,
      total_sale_price: computedTotalSalePrice.value, // Precio total calculado
      image: formData.value.image,
      stock: parseInt(formData.value.stock, 10) || 0,
    };

    await useApi("product/" + id, "PUT", dataUpdated);

    Swal.fire({
      title: "Éxito",
      text: "Producto actualizado con éxito",
      icon: "success",
      confirmButtonText: "¡Entendido!",
    }).then(() => {
      if (discardButton.value) {
        discardButton.value.click();
      }
      resetFormData();
      fetchProducts(); // Recargar la tabla desde la API
    });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
  }
};

//ELIMINAR PRODUCTOS
const deleteProduct = async (product) => {
  const result = await Swal.fire({
    title: "¿Estás seguro de eliminar el producto?",
    text: "No podrás recuperar el producto eliminado.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "¡Sí, eliminar!",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      await useApi("product/"+ product.id, "DELETE");

      // Eliminar producto de `tableData` localmente
      filteredData.value = filteredData.value.filter((item) => item.id !== product.id);

      Swal.fire({
        title: "¡Eliminado!",
        text: "El producto ha sido eliminado con éxito.",
        icon: "success",
        confirmButtonText: "¡Entendido!",
      });

      // Recargar la tabla desde la API (opcional, para garantizar datos actualizados)
      fetchProducts(); // Recargar la tabla desde la API

    } catch (error) {
      console.error("Error al eliminar el producto:", error);

      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el producto. Inténtelo de nuevo.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  }
};

const computedSalePrice = computed(() => {
  const purchasePrice = parseFloat(formData.value.purchase_price) || 0;
  const profitMargin = parseFloat(formData.value.profit_margin) || 0;
  return purchasePrice + (purchasePrice * profitMargin / 100);
});

const computedTotalSalePrice = computed(() => {
  const salePrice = computedSalePrice.value;
  const vat = parseFloat(formData.value.vat) || 0;
  return salePrice + (salePrice * vat / 100);
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