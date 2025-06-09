<script setup>
defineProps({
    label: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    values: {
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

const modelValue = defineModel({ default: 'm' });
</script>

<template>
    <section>
        <div class="block text-sm font-medium">{{ label }}<span class="text-red-400 ml-0.5">*</span>
        </div>
        <div class="flex gap-8 mt-1 items-center" :class="{ 'h-10': fixHeight }">
            <section v-for="(input, index) in values" :key="index" class="flex items-center gap-2 accent-accent">
                <label :for="input.label" class="text-sm" :class="{ 'text-gray-500': disabled }"
                    v-if="modelValue == input.value || !disabled">{{ input.label
                    }}</label>
                <input type="radio" :id="input.label" :name :value="input.value" @change="modelValue = input.value"
                    :checked="input.value == modelValue" v-if="!disabled" :disabled required
                    class="user-invalid:accent-red-300" />
            </section>
        </div>
    </section>
</template>