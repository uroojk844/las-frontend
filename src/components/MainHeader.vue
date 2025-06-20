<script setup>
defineProps({
    title: {
        type: String,
    }
});
</script>

<template>
    <section class="flex justify-between items-center mb-4 print:hidden">
        <h1 class="text-2xl font-bold">{{ title }}</h1>
        <slot></slot>
    </section>
</template>