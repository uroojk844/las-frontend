<script setup lang="ts">
import FilledButton from '@/components/FilledButton.vue';
import Model from '@/components/Model.vue';
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import TableAdaptor from '@/components/TableAdaptor.vue';
import InputField from '@/components/InputField.vue';
import MainHeader from '@/components/MainHeader.vue';
import SelectField from '@/components/SelectField.vue';
import { useUniformStore } from '@/store/uniform.store';
import { IUniform } from '@/store/uniform.interface';
import RadioGroup from '@/components/RadioGroup.vue';

const uniformStore = useUniformStore();
const { getIsLoadingUniform, getSizeOptions, getUniforms, getIsUpdatingUniform, getIsDeletingUniform, getIsAddingUniform } = storeToRefs(uniformStore);

const defaultValue: IUniform = {
    id: 0,
    name: '',
    gender: 'm',
    size: '',
    size_id: 0,
    buying_price: 0,
    selling_price: 0,
};

const selectedUniform = ref<IUniform>({ ...defaultValue });

const isEditing = ref(false);
const isFormOpen = ref<boolean>(false);

function addBook() {
    isEditing.value = false;
    isFormOpen.value = true;
    selectedUniform.value = { ...defaultValue };
}

function setUniformDetails(id: number) {
    isEditing.value = true;
    isFormOpen.value = true;
    let uniform = getUniforms.value.find((uniform) => uniform.id == id);
    if (!!uniform) {
        selectedUniform.value = uniform;
    }
}

function handleModelSubmit(event: Event) {
    if (isEditing.value) {
        uniformStore.updateUniform(event);
    } else {
        uniformStore.addUniform(event);
        uniformStore.fetchUniformList(true);
    }
    isFormOpen.value = false;
}

onMounted(() => {
    uniformStore.fetchUniformList();
})
</script>

<template>
    <MainHeader title="All Uniform">
        <FilledButton @click="addBook">
            <icon icon="ph:plus-bold" /> Add uniform
        </FilledButton>
    </MainHeader>

    <section class="grid bg-surface p-4 rounded-md">
        <TableAdaptor title="Books information"
            :headers="['Name', 'Gender', 'Size', 'Selling Price', 'Buying Price', 'Actions']" :data="getUniforms"
            filterBy="size" :loading="getIsLoadingUniform">
            <template #default="{ data }">
                <tr v-for="(uniform, index) in data" :key="index" class="hover:bg-background cursor-pointer">
                    <td>{{ uniform.name }}</td>
                    <td class="capitalize">{{ uniform.gender }}</td>
                    <td>{{ uniform.size }}</td>
                    <td>{{ uniform.selling_price }}</td>
                    <td>{{ uniform.buying_price }}</td>
                    <td class="max-w-32">
                        <div class="flex gap-4 items-center justify-evenly">
                            <FilledButton @click="setUniformDetails(uniform.id)" type="primary" size="sm"
                                :isLoading="getIsUpdatingUniform">
                                <icon icon="ph:pen-bold" /> Update
                            </FilledButton>

                            <FilledButton @click="uniformStore.deleteUniform(uniform.id)" type="danger" size="sm"
                                :isLoading="getIsDeletingUniform">
                                <icon icon="ph:trash-bold" /> Delete
                            </FilledButton>
                        </div>
                    </td>
                </tr>
            </template>
        </TableAdaptor>
    </section>

    <Model v-model="isFormOpen">
        <MainHeader :title="isEditing ? 'Edit uniform details' : 'Add uniform'" />
        <form @submit.prevent="handleModelSubmit" class="grid sm:grid-cols-2 gap-4">
            <input type="hidden" v-model="selectedUniform.id" name="id" :required="isEditing">
            <InputField label="Uniform name" name="name" v-model="selectedUniform.name" />
            <SelectField label="Size" name="size_id" v-model="selectedUniform.size_id" :options="getSizeOptions"
                position="bottom" />
            <InputField label="Buying price" name="buying_price" type="number" :min="1"
                v-model="selectedUniform.buying_price" />
            <InputField label="Selling price" name="selling_price" type="number" :min="1"
                v-model="selectedUniform.selling_price" />
            <RadioGroup label="Gender" name="gender" v-model="selectedUniform.gender" />
            <div class="col-span-full">
                <FilledButton :isLoading="getIsUpdatingUniform || getIsAddingUniform">{{ isEditing ? 'Update' : 'Add' }}
                </FilledButton>
            </div>
        </form>
    </Model>
</template>

<style scoped>
@reference "@/style.css";

td {
    @apply p-2;
}
</style>