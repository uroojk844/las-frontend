<script setup lang="ts">
import FilledButton from '@/components/FilledButton.vue';
import MainHeader from '@/components/MainHeader.vue';
import { RouterLink } from 'vue-router';
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import TableAdaptor from '@/components/TableAdaptor.vue';
import { useUniformStore } from '@/store/uniform.store';
import useUserStore from '@/store/user';

const userStore = useUserStore();
const uniformStore = useUniformStore();
const { getIsLoadingUniform, getUniforms } = storeToRefs(uniformStore);

onMounted(() => {
    uniformStore.fetchUniformList();
})

</script>

<template>
    <MainHeader title="All Uniform">
        <RouterLink v-if="userStore.getRole == 'super'" to="/uniform/edit">
            <FilledButton>
                <icon icon="ph:plus-bold" /> Add uniform
            </FilledButton>
        </RouterLink>
    </MainHeader>

    <section class="grid bg-surface p-4 rounded-md">
        <TableAdaptor title="Uniform list" :headers="['Name', 'Size', 'Gender', 'Price']" :data="getUniforms"
            filterBy="size" :loading="getIsLoadingUniform">
            <template #default="{ data }">
                <tr v-for="(uniform, index) in data" :key="index" class="hover:bg-background cursor-pointer">
                    <td>{{ uniform.name }}</td>
                    <td>{{ uniform.size }}</td>
                    <td class="capitalize">{{ uniform.gender }}</td>
                    <td>{{ uniform.selling_price }}</td>
                </tr>
            </template>
        </TableAdaptor>
    </section>
</template>

<style scoped>
@reference "@/style.css";

td {
    @apply p-2;
}
</style>