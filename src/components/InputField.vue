<script setup lang="ts">
const {
    type = 'text',
    name = '',
    placeholder = '',
    required = true,
    disabled = false } =
    defineProps<{
        label?: string;
        type?: string;
        name?: string;
        placeholder?: string;
        required?: boolean;
        disabled?: boolean;
    }>();

const modelValue = defineModel<string | number>();

defineOptions({
    inheritAttrs: false
})
</script>

<template>
    <div class="grid">
        <label v-if="label" :for="name" class="block text-sm font-medium text-dark-gray capitalize">{{ label }}<span
                v-if="required" class="text-red-400 ml-0.5">*</span></label>
        <input :type :id="name" :name :placeholder="placeholder || label" :disabled :required v-model="modelValue"
            v-bind="$attrs"
            class="mt-1 w-full px-3 py-2 border border-border user-invalid:border-red-300 rounded bg-surface focus:outline-none focus:ring-primary focus:border-primary sm:text-sm  disabled:text-gray-500 disabled:border-0 disabled:px-0">

    </div>
</template>