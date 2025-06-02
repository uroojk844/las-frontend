<script setup>
import { Icon } from '@iconify/vue';
const { data } = defineProps(['data']);
</script>

<template>
    <div class="card">
        <div>
            <div class="label">{{ data.label }}</div>
            <div class="value">{{ data.value }}</div>
        </div>
        <Icon :icon="data.icon" />
    </div>
</template>

<style scoped>
@reference "@/style.css";

.card {
    @apply bg-white p-4 flex justify-between items-center min-w-40 rounded-lg border border-gray-200;

    .label {
        @apply text-light-gray text-sm mb-1;
    }

    .value {
        @apply text-2xl font-bold text-black;
    }

    svg {
        @apply text-5xl text-primary;
    }
}
</style>