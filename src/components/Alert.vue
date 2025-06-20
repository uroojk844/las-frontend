<script setup>
import { storeToRefs } from 'pinia';
import { useAlertStore } from '@/store/Alert';

const alertStore = useAlertStore()
const { getAlert } = storeToRefs(alertStore);
</script>

<template>
    <div v-if="getAlert"
        class="animate transition-all duration-300 fixed top-20 right-8 rounded-md z-50 px-3 py-2.5 flex justify-between items-center gap-2 min-w-60"
        :class="{
            'bg-emerald-500 text-gray-50': getAlert.type == 'success',
            'bg-red-400 text-gray-50': getAlert.type == 'error',
        }">
        <icon :icon="getAlert.type == 'success' ? 'ph:check-circle-bold' : 'ph:x-circle-bold'" class="text-lg" />
        <span class="flex-1 line-clamp-3 max-w-60">{{ getAlert.message }}</span>
    </div>
</template>

<style scoped>
.animate {
    animation: from-right 4s ease;
}

@keyframes from-right {
    0% {
        transform: translateX(100%);
    }

    10% {
        transform: translateX(0);
    }

    90% {
        transform: translateX(0%);
    }

    100% {
        transform: translateX(100%);
    }
}
</style>