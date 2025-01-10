<template>
  <div class="container mt-3">
    <div class="card shadow">
      <div class="card-header text-center bg-primary text-white">
        <h3>Configuración</h3>
      </div>
      <div class="card-body">
        <!-- Información del Usuario -->
        <div class="text-center mb-4">
          <img :src="configuracion.imagenUsuario" alt="Imagen del Usuario" class="img-fluid rounded-circle" width="150" />
          <h4 class="mt-2">{{ configuracion.rol }}</h4>
        </div>
        <!-- Campos de Configuración -->
        <div class="row mb-4">
          <div class="col-md-6">
            <label for="primerNombre" class="form-label">Primer Nombre</label>
            <input type="text" id="primerNombre" class="form-control" v-model="configuracion.primerNombre" />
          </div>
          <div class="col-md-6">
            <label for="segundoNombre" class="form-label">Segundo Nombre</label>
            <input type="text" id="segundoNombre" class="form-control" v-model="configuracion.segundoNombre" />
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-md-6">
            <label for="primerApellido" class="form-label">Primer Apellido</label>
            <input type="text" id="primerApellido" class="form-control" v-model="configuracion.primerApellido" />
          </div>
          <div class="col-md-6">
            <label for="segundoApellido" class="form-label">Segundo Apellido</label>
            <input type="text" id="segundoApellido" class="form-control" v-model="configuracion.segundoApellido" />
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-md-6">
            <label for="email" class="form-label">Correo Electrónico</label>
            <input type="email" id="email" class="form-control" v-model="configuracion.email" />
          </div>
          <div class="col-md-6">
            <label for="celular" class="form-label">Celular</label>
            <input type="text" id="celular" class="form-control" v-model="configuracion.celular" />
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-md-6">
            <label for="imagenUsuario" class="form-label">Subir Imagen</label>
            <input type="file" id="imagenUsuario" class="form-control" @change="handleImageUpload" />
          </div>
          <div class="col-md-6">
            <label for="password" class="form-label">Contraseña</label>
            <input type="password" id="password" class="form-control" v-model="configuracion.password" />
          </div>
        </div>
        <!-- Botones de Acción -->
        <div class="row mt-4">
          <div class="col-md-12 text-end">
            <button class="btn btn-success me-2" @click="guardarConfiguracion">
              <i class="fas fa-save"></i> Guardar
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
      configuracion: {
        imagenUsuario: 'https://via.placeholder.com/150', // URL de la imagen del usuario
        rol: 'Administrador', // Rol del usuario
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        email: '',
        celular: '',
        password: ''
      }
    };
  },
  methods: {
    guardarConfiguracion() {
      // Lógica para guardar la configuración
      console.log('Configuración guardada', this.configuracion);
    },
    limpiarFormulario() {
      this.configuracion = {
        imagenUsuario: 'https://via.placeholder.com/150',
        rol: 'Administrador',
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        email: '',
        celular: '',
        password: ''
      };
    },
    cancelar() {
      // Lógica para cancelar operación
      console.log('Operación cancelada');
      this.$router.push('/');
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.configuracion.imagenUsuario = e.target.result;
        };
        reader.readAsDataURL(file);
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