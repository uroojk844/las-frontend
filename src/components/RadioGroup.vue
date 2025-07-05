<script setup lang="ts">
import { onMounted } from 'vue';

const { selected, fixHeight = true, values = [
    {
        label: 'Male',
        value: 'm',
    },
    {
        label: 'Female',
        value: 'f',
    },
] } = defineProps<{
    label: string,
    name: string,
    values?: {
        label: string,
        value: string | number;
    }[],
    selected?: string,
    fixHeight?: boolean,
    disabled?: boolean
}
>();

const modelValue = defineModel<string | number>({ default: 'm' });

onMounted(() => {
    if (selected) modelValue.value = selected;
})
</script>

<template>
    <section>
        <div class="block text-sm font-medium text-dark-gray">{{ label }}<span class="text-red-400 ml-0.5">*</span>
        </div>
        <div class="flex mt-1 items-center" :class="{ 'h-10': fixHeight, 'gap-8': !disabled }">
            <section v-for="(input, index) in values" :key="index" class="flex items-center gap-2 accent-accent">
                <label :for="input.label" class="text-sm" :class="{ 'text-gray-500': disabled }"
                    v-if="modelValue == input.value || !disabled">
                    {{ input.label }}
                </label>
                <input type="radio" :id="input.label" :name :value="input.value" @change="modelValue = input.value"
                    :checked="input.value == modelValue" :disabled required class="user-invalid:accent-red-300"
                    :class="{ 'hidden': disabled }" />
            </section>
        </div>
    </section>
</template>