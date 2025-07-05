<script setup lang="ts">
const { name = '', fixHeight = true, disabled = false, disabledFields = [] } = defineProps<{
    label: string,
    name?: string;
    options: { label: string, value: string | number }[],
    fixHeight?: boolean;
    disabled?: boolean;
    disabledFields?: string[],
}>();

const modelValue = defineModel<string[] | number[]>({ default: [] });

function isChecked(value: string | number) {
    return modelValue.value.map(v => v.toString()).includes(value.toString()) || disabledFields.includes(value.toString());
}
</script>

<template>
    <section>
        <div v-if="label" class="block text-sm font-medium to-gray-700">{{ label }}<span
                class="text-red-400 ml-0.5">*</span>
        </div>
        <div class="flex gap-x-8 gap-2 flex-wrap gap-y-2 mt-1 items-center" :class="{ 'h-10': fixHeight }">
            <section v-for="(input, index) in options" :key="index" class="flex gap-2 items-center accent-accent">
                <label :for="input.label" class="text-sm capitalize" :class="{ 'text-gray-500': disabled }"
                    v-if="isChecked(input.value) || !disabled">
                    {{ input.label }}
                </label>
                <input type="checkbox" :id="input.label" :name :value="input.value" v-model="modelValue" :disabled="disabledFields.includes(input.value.toString())||disabled"
                    class="user-invalid:accent-red-300" :class="{ 'hidden': disabled }" />
            </section>
        </div>
    </section>
</template>