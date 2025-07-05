<script setup lang="ts">
import { computed, ref } from 'vue';
import { handleClickedOutside } from "@/utils/handleClickOutside";

interface IOptions {
    label: string;
    value: any;
}

const { label = '', name = '', options = [], disabled = false, position = 'top', required = true
} = defineProps<{
    label?: string,
    name?: string,
    options?: IOptions[];
    required?: boolean;
    disabled?: boolean;
    position?: 'top' | 'bottom';
}>();

const modelValue = defineModel<string | number>({ default: "" });
const emit = defineEmits(['change'])

const selectBox = ref(null)
const isOpen = ref(false)

function setSelected(value: string) {
    modelValue.value = value;
    isOpen.value = false;
    emit('change', modelValue.value);
}

const getLabel = computed(() => {
    if (options.length && modelValue.value) {
        return options.find((option) => option.value == modelValue.value)?.label;
    }
});

function toggleSelectField() {
    if (disabled) return;

    isOpen.value = !isOpen.value;
}

handleClickedOutside(selectBox, isOpen);
</script>

<template>
    <div class="grid min-w-40">
        <div v-if="label" class="cursor-pointer text-sm font-medium text-dark-gray">
            {{ label }}<span v-if="required" class="text-red-400 ml-0.5">*</span>
        </div>
        <section class="relative" ref="selectBox">
            <input type="text" :name class="peer hidden" v-model="modelValue" :required />
            <div @click="toggleSelectField"
                class="mt-1 flex items-center justify-between w-full px-3 py-2 border border-border rounded bg-surface peer-user-invalid:border-red-300 sm:text-sm cursor-pointer"
                :class="{ 'text-gray-500 border-0 px-0': disabled }">
                {{ getLabel || 'Select' }}
                <icon v-if="!disabled" icon="tabler:chevron-right" class="text-lg  transition-transform"
                    :class="isOpen ? '-rotate-90' : 'rotate-90'" />
            </div>
            <ul v-show="isOpen"
                class="absolute bg-surface overflow-y-auto top-0 max-h-60 w-full border border-border rounded-md text-sm"
                :class="{
                    '-translate-y-full': position == 'top',
                    'translate-y-11': position == 'bottom',
                }">
                <li v-for="(item, index) in options" :key="index" @click="setSelected(item.value)"
                    class="p-2 cursor-pointer hover:bg-secondary whitespace-nowrap"
                    :class="{ 'bg-secondary': item.value == modelValue }">
                    {{ item.label }}
                </li>
            </ul>
        </section>
    </div>
</template>