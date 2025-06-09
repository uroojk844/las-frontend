<script setup>
defineProps({
    label: {
        type: String
    },
    type: {
        type: String,
        default: 'text',
    },
    name: {
        type: String,
        required: true,
    },
    placeholder: {
        type: String,
        default: '',
    },
    required: {
        type: Boolean,
        default: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    }
})

const modelValue = defineModel();
</script>

<template>
    <div class="grid">
        <label :for="name" class="block text-sm font-medium text-gray-700">{{ label }}<span v-if="required"
                class="text-red-400 ml-0.5">*</span></label>
        <input :type :id="name" :name :placeholder="placeholder || label" :disabled :required v-model="modelValue"
            class="mt-1 w-full px-3 py-2 border border-gray-200 user-invalid:border-red-300 rounded bg-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm  disabled:text-gray-500 disabled:border-0 disabled:px-0">

    </div>
</template>