<script setup lang="ts">
const isOpen = defineModel<boolean>({ default: false });
defineOptions({
    inheritAttrs: false
})
</script>

<template>
    <section v-if="isOpen" class="fixed inset-0 bg-black/30 grid place-items-center p-4" @click.self="isOpen = false">
        <div class="p-8 rounded bg-surface w-full max-w-3xl" v-bind="$attrs">
            <slot></slot>
        </div>
    </section>
</template>