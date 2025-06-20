<script setup>
import { computed, ref } from 'vue';
import ResponsiveTable from './ResponsiveTable.vue';
import { containsValue } from '../utils/searchFunctions';

const { data, filterBy } = defineProps({
    title: String,
    filterBy: String,
    message: {
        type: String,
        default: 'Nothing to show here',
    },
    headers: {
        type: Array,
        required: true,
    },
    data: {
        type: Array,
        required: true,
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

const filter = ref('');
const columnFilter = ref('')

const filteredData = computed(() => {
    if (filterBy) {
        return data.filter(row => columnFilter.value.length ? row[filterBy] == columnFilter.value : row[filterBy]).filter(v => containsValue(v, filter.value))
    }
    return data?.filter(v => containsValue(v, filter.value))
})
const columnFiltered = computed(() => new Set(data.map(d => d[filterBy])));
</script>

<template>
    <section>
        <div class="flex gap-4 items-center mb-4">
            <h1 class="text-xl font-medium mr-auto">{{ title }}</h1>
            <div
                class="max-sm:hidden flex items-center gap-2 bg-background h-8 rounded overflow-hidden max-w-64 w-full">
                <input type="search" v-model="filter" placeholder="Search" class="h-full pl-2 w-full" />
                <icon icon="ph:magnifying-glass-bold" />
            </div>
            <div v-if="filterBy"
                class="max-sm:hidden flex items-center gap-2 px-2 bg-background h-8 rounded max-w-32 w-full">
                <select v-model="columnFilter" class="flex-1">
                    <option value="" selected>Select</option>
                    <option :value="item" class="capitalize" v-for="(item, index) in columnFiltered" :key="index">{{
                        item }}
                    </option>
                </select>
                <icon @click="columnFilter = ''" v-if="columnFilter" class="cursor-pointer hover:text-red-400"
                    icon="material-symbols:close-rounded" />
                <icon v-else icon="material-symbols:filter-list-rounded" />
            </div>
            <slot name="extensions"></slot>
        </div>
        <ResponsiveTable :headers :dataLength="filteredData?.length" :loading :message>
            <slot :data="filteredData"></slot>
        </ResponsiveTable>
    </section>
</template>