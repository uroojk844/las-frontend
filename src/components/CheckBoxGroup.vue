<script setup>
defineProps({
    label: {
        type: String,
        required: true,
    },
    name: String,
    options: {
        type: Array,
        default: () => [
            {
                label: 'Male',
                value: 'm',
            },
            {
                label: 'Female',
                value: 'f',
            },
        ],
    },
    fixHeight: {
        type: Boolean,
        default: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    }
})

const modelValue = defineModel({ default: ['m'] });

function isChecked(value) {
    return modelValue.value.includes(value);
}
</script>

<template>
    <section>
        <div class="block text-sm font-medium">{{ label }}<span class="text-red-400 ml-0.5">*</span>
        </div>
        <div class="flex gap-x-8 gap-2 flex-wrap gap-y-2 mt-1 items-center"
            :class="{ 'h-10': fixHeight }">
            <section v-for="(input, index) in options" :key="index" class="flex gap-2 items-center accent-accent">
                <label :for="input.label" class="text-sm capitalize" :class="{ 'text-gray-500': disabled }"
                    v-if="isChecked(input.value) || !disabled">
                    {{ input.label }}
                </label>
                <input type="checkbox" :id="input.label" :name :value="input.value" v-model="modelValue" :disabled
                    class="user-invalid:accent-red-300" :class="{ 'hidden': disabled }" />
            </section>
        </div>
    </section>
</template>