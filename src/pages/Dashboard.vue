<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Card from '@/components/Dashboard/Card.vue';
import MainHeader from '@/components/MainHeader.vue';
import { RouterLink } from 'vue-router';
import { Bar, Pie } from 'vue-chartjs';
import { useDashboardStore } from '../store/dashboard';
import { storeToRefs } from 'pinia';

const dashboardStore = useDashboardStore();
const { getDashboartData, getLoadingStudentsData, getStudentsChartData } = storeToRefs(dashboardStore);

const dashboardData = computed(() => [
  { label: 'Total students', value: getDashboartData.value?.total_students, icon: 'ph:student-fill', path: '/student' },
  { label: 'Total admins', value: getDashboartData.value?.total_admins, icon: 'ph:users-three-fill', path: '/admin' },
]);

const usersChartData = computed(() => {
  return {
    labels: dashboardData.value.map(d => d.label),
    datasets: [
      {
        data: dashboardData.value.map(d => d.value)
      }
    ],
  }
});


onMounted(() => {
  dashboardStore.initialize();
});
</script>

<template>
  <MainHeader title="Analytics" />
  <section class="mb-4 gap-4 grid sm:grid-cols-2 md:grid-cols-3">
    <div class="relative p-4 bg-surface rounded-md border border-border">
      <Pie :data="usersChartData as any" :options="{
        plugins: {
          legend: {
            labels: {
              color: '#a4a5a4',
            }
          },
          title: {
            text: 'All users',
          },
        }
      }" />
    </div>

    <div v-if="getLoadingStudentsData" class="relative min-h-80 sm:col-span-2 p-4 bg-surface rounded-md border border-border">
      <Bar :data="getStudentsChartData" :options="{
        plugins: {
          legend: {
            labels: {
              color: '#a4a5a4',
            }
          },
          title: {
            text: 'Class wise student\'s data',
            position: 'top',
            padding: {
              top: 0,
            }
          }
        },
      }" />
    </div>
  </section>

  <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <RouterLink v-for="(data, index) in dashboardData" :key="index" :to="data.path">
      <Card :data />
    </RouterLink>
  </section>
</template>

<style scoped>
@reference "@/style.css";
</style>