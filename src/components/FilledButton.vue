<script setup>
const { type } = defineProps({
    type: {
        type: String,
        default: "primary"
    },
    size: {
        type: String,
        default: "md"
    }
});
</script>

<template>
    <button class="flex items-center gap-2 text-white hover:brightness-110" :class="{
        'bg-primary': type === 'primary',
        'bg-red-400': type === 'danger',
        'bg-green-400': type === 'success',
        'bg-light-gray': type === 'disabled',
        'py-2 px-5 rounded-md': size === 'md',
        'py-1 px-3 rounded': size === 'sm',
    }" :disabled="type === 'disabled'">
        <slot></slot>
    </button>
</template>