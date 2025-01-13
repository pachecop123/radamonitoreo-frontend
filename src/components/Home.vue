<template>
  <div class="container mt-4">
    <div class="row mb-3">
      <div class="col-md-3">
        <div class="card text-white bg-primary compact-card">
          <div class="card-header">
            <i class="bi bi-box-seam"></i> Productos
          </div>
          <div class="card-body">
            <h5 class="card-title">150</h5>
            <p class="card-text">Número total de productos</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-white bg-success compact-card">
          <div class="card-header">
            <i class="bi bi-people"></i> Clientes
          </div>
          <div class="card-body">
            <h5 class="card-title">200</h5>
            <p class="card-text">Número total de clientes</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-white bg-warning compact-card">
          <div class="card-header">
            <i class="bi bi-cart"></i> Ventas
          </div>
          <div class="card-body">
            <h5 class="card-title">300</h5>
            <p class="card-text">Número total de ventas</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-white bg-danger compact-card">
          <div class="card-header">
            <i class="bi bi-currency-dollar"></i> Ingresos
          </div>
          <div class="card-body">
            <h5 class="card-title">$5000</h5>
            <p class="card-text">Ingresos totales</p>
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-md-12">
        <div class="card compact-card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>Ventas del Mes</span>
            <select v-model="selectedMonth" @change="updateChart">
              <option v-for="(month, index) in months" :key="index" :value="index">{{ month }}</option>
            </select>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <canvas id="salesChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const selectedMonth = ref(0);
const salesData = ref([]);
const chartInstance = ref(null);
const months = ref([
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]);

const generateSalesData = (days) => {
  return Array.from({ length: days }, () => Math.floor(Math.random() * 100) + 1);
};

const updateChart = () => {
  const daysInMonth = new Date(2023, selectedMonth.value + 1, 0).getDate();
  salesData.value = generateSalesData(daysInMonth);
  renderChart();
};

const renderChart = () => {
  const ctx = document.getElementById("salesChart").getContext("2d");
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
  chartInstance.value = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from({ length: salesData.value.length }, (_, i) => i + 1),
      datasets: [
        {
          label: "Ventas",
          data: salesData.value,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

onMounted(() => {
  updateChart();
});

onBeforeUnmount(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
});
</script>

<style scoped>
.card {
  text-align: center;
}
.compact-card {
  padding: 10px;
  margin-bottom: 15px;
}
.card-header {
  font-size: 0.9rem;
  padding: 8px 10px;
}
.card-title {
  font-size: 1.4rem;
}
.card-text {
  font-size: 0.85rem;
}
select {
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #ced4da;
}
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>
