<script setup lang="ts">
const { rows = 3, disabled = false, required = true } = defineProps<{
    label?: string;
    name?: string;
    placeholder?: string;
    required?: boolean;
    rows?: number;
    disabled?: boolean;
}>();

const modelValue = defineModel<string>();
</script>

<template>
    <div class="grid">
        <label :for="name" class="block text-sm font-medium text-dark-gray">{{ label }}<span v-if="required"
                class="text-red-400 ml-0.5">*</span></label>
        <textarea :rows :id="name" :name :placeholder="placeholder || label" v-model="modelValue" :disabled :required
            class="mt-1 w-full px-3 py-2 border border-border user-invalid:border-red-300 rounded bg-surface focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:text-gray-500 disabled:border-0 disabled:px-0 disabled:resize-none"></textarea>
    </div>
</template>