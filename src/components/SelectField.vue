<script setup>
import { ref } from 'vue';
import { handleClickedOutside } from "@/utils/handleClickOutside";

const { disabled } = defineProps({
    label: String,
    options: Array,
    name: {
        type: String,
        required: true,
    },
    required: {
        type: Boolean,
        default: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const modelValue = defineModel({ default: null });
const emit = defineEmits(['change'])

const selectBox = ref(null)
const isOpen = ref(false)

function setSelected(value) {
    modelValue.value = value;
    isOpen.value = false;
    emit('change', modelValue.value);
}

function toggleSelectField() {
    if (disabled) return;

    isOpen.value = !isOpen.value;
}

handleClickedOutside(selectBox, isOpen)
</script>

<template>
    <div class="grid">
        <div class="cursor-pointer text-sm font-medium text-gray-700">
            {{ label }}<span v-if="required" class="text-red-400 ml-0.5">*</span>
        </div>
        <section class="relative" ref="selectBox">
            <input type="text" :name class="peer hidden" v-model="modelValue" :required />
            <div @click="toggleSelectField"
                class="mt-1 flex items-center justify-between w-full px-3 py-2 border border-gray-200 rounded bg-white peer-user-invalid:border-red-300 sm:text-sm cursor-pointer"
                :class="{ 'text-gray-500 border-0 px-0': disabled }">
                {{ modelValue || 'Select' }}
                <icon v-if="!disabled" icon="tabler:chevron-right" class="text-lg  transition-transform"
                    :class="isOpen ? '-rotate-90' : 'rotate-90'" />
            </div>
            <ul v-show="isOpen"
                class="absolute bg-white overflow-y-auto top-0 -translate-y-full max-h-60 w-full border border-gray-200 rounded-md text-sm">
                <li v-for="(item, index) in options" :key="index" @click="setSelected(item)"
                    class="p-2 cursor-pointer hover:bg-secondary">
                    {{ item }}
                </li>
            </ul>
        </section>
    </div>
</template>