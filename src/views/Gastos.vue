<template>
  <div class="container mt-3">
    <div class="card shadow">
      <div class="card-header text-center bg-primary text-white">
        <h3>Gestión de Gastos</h3>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <!-- Información del Gasto -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="fecha" class="form-label">Fecha</label>
              <input type="date" id="fecha" class="form-control" v-model="gasto.fecha" required />
            </div>
            <div class="col-md-6">
              <label for="tipo" class="form-label">Tipo de Gasto</label>
              <select id="tipo" class="form-select" v-model="gasto.tipo" required>
                <option value="">Seleccione un tipo</option>
                <option value="administrativos">Administrativos</option>
                <option value="operativos">Operativos</option>
                <option value="no operativos">No Operativos</option>
                <option value="ventas">Ventas</option>
                <option value="otros">Otros</option>
              </select>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-12">
              <label for="descripcion" class="form-label">Descripción</label>
              <input type="text" id="descripcion" class="form-control" v-model="gasto.descripcion" required />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="valor" class="form-label">Valor</label>
              <input type="number" id="valor" class="form-control" v-model="gasto.valor" required />
            </div>
          </div>
          <!-- Botones de Acción -->
          <div class="row mb-3">
            <div class="col-md-12 text-end">
              <button type="submit" class="btn btn-primary me-2">{{ editMode ? 'Actualizar Gasto' : 'Guardar Gasto' }}</button>
              <button type="button" class="btn btn-secondary me-2" @click="limpiarFormulario">Limpiar</button>
              <button type="button" class="btn btn-danger" @click="cancelar">Cancelar</button>
            </div>
          </div>
        </form>
        <!-- Tabla de Gastos -->
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
                  <th>Fecha</th>
                  <th>Tipo de Gasto</th>
                  <th>Descripción</th>
                  <th>Valor</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(g, index) in filtrarGastos()" :key="index">
                  <td>{{ g.fecha }}</td>
                  <td>{{ g.tipo }}</td>
                  <td>{{ g.descripcion }}</td>
                  <td>{{ g.valor }}</td>
                  <td>
                    <button class="btn btn-sm btn-warning me-2" @click="editGasto(index)">Editar</button>
                    <button class="btn btn-sm btn-danger" @click="deleteGasto(index)">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
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
      gasto: {
        fecha: '',
        tipo: '',
        descripcion: '',
        valor: 0,
      },
      gastos: [],
      editMode: false,
      editIndex: -1,
      filtro: 'todos',
    };
  },
  methods: {
    handleSubmit() {
      if (this.editMode) {
        this.gastos.splice(this.editIndex, 1, { ...this.gasto });
        this.editMode = false;
        this.editIndex = -1;
      } else {
        this.gastos.push({ ...this.gasto });
      }
      this.limpiarFormulario();
    },
    limpiarFormulario() {
      this.gasto = {
        fecha: '',
        tipo: '',
        descripcion: '',
        valor: 0,
      };
    },
    editGasto(index) {
      this.gasto = { ...this.gastos[index] };
      this.editMode = true;
      this.editIndex = index;
    },
    deleteGasto(index) {
      this.gastos.splice(index, 1);
    },
    cancelar() {
      this.$router.push('/');
    },
    filtrarGastos() {
      const hoy = new Date().toISOString().split('T')[0];
      const unaSemanaAntes = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];
      const quinceDiasAntes = new Date(new Date().setDate(new Date().getDate() - 15)).toISOString().split('T')[0];

      if (this.filtro === 'hoy') {
        return this.gastos.filter(g => g.fecha === hoy);
      } else if (this.filtro === 'semana') {
        return this.gastos.filter(g => g.fecha >= unaSemanaAntes && g.fecha <= hoy);
      } else if (this.filtro === '15dias') {
        return this.gastos.filter(g => g.fecha >= quinceDiasAntes && g.fecha <= hoy);
      } else {
        return this.gastos;
      }
    },
  },
};
</script>

<style scoped>
.card-header {
  font-size: 1.5rem;
}
button {
  min-width: 100px;
}
</style>