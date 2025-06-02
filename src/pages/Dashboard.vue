<script setup>
import Card from '../components/Dashboard/Card.vue';

const dashboardData = [
  { label: 'Students', value: 1500, icon: 'ph:student-fill' },
  { label: 'Courses', value: 30, icon: 'ph:book-open-fill' },
  { label: 'Instructors', value: 10, icon: 'ph:user-check-fill' },
  { label: 'Reviews', value: 250, icon: 'ph:star-fill' }
];
</script>

<template>
  <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <Card v-for="(data, index) in dashboardData" :key="index" :data />
  </section>
</template>

<style scoped>
@reference "@/style.css";
</style>