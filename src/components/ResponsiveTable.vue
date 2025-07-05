<script setup lang="ts">
import Loader from "./Loader.vue";

defineProps({
    headers: {
        type: Array,
        required: true,
    },
    dataLength: Number,
    loading: {
        type: Boolean,
        default: false,
    },
    message: String,
});
</script>

<template>
    <Loader v-if="loading" />
    <div v-else-if="dataLength" class="grid overflow-x-auto">
        <table class="table table-auto w-full rounded-md overflow-hidden whitespace-nowrap">
            <thead>
                <tr class="bg-secondary text-light-gray font-medium">
                    <td v-for="(item, index) in headers" :key="index">{{ item }}</td>
                </tr>
            </thead>
            <tbody>
                <slot></slot>
            </tbody>
        </table>
    </div>
    <div v-else class="text-light-gray text-center py-8">{{ message }}</div>
</template>


<style>
@reference "@/style.css";

td {
    @apply p-2 truncate;
}
</style>