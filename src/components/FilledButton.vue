<script setup>
defineProps({
    type: {
        type: String,
        default: "primary"
    },
    size: {
        type: String,
        default: "md"
    },
    isLoading: {
        type: Boolean,
        default: false
    }
});
</script>

<template>
    <button class="flex items-center gap-2 justify-center whitespace-nowrap disabled:bg-light-gray text-white hover:brightness-110"
        :class="{
            'bg-primary': type === 'primary',
            'bg-red-400': type === 'danger',
            'bg-green-400': type === 'success',
            'bg-gray-400': isLoading,
            'py-2 px-5 rounded-md': size === 'md',
            'py-1 px-3 rounded': size === 'sm',
        }" :disabled="type === 'disabled' || isLoading">
        <span v-if="isLoading" class="py-1"><icon icon="svg-spinners:ring-resize" /></span>
        <slot v-else></slot>
    </button>
</template>