<script setup>
import FilledButton from '@/components/FilledButton.vue';
import MainHeader from '@/components/MainHeader.vue';
import InputField from "@/components/InputField.vue";
import RadioGroup from "@/components/RadioGroup.vue";
import SelectField from "@/components/SelectField.vue";
import TextField from "@/components/TextField.vue";
import Loader from "@/components/Loader.vue"

import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import useUserStore from '@/store/user';
import { useStudentsStore } from '@/store/students';
import { storeToRefs } from 'pinia';
import PhotoPicker from '../../components/PhotoPicker.vue';
import { useAlertStore } from '../../store/Alert';

const alertStore = useAlertStore()


const disabled = ref(true)
const classList = ['Nursury', 'LKG', 'UKG', '1', '2', 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const studentsStore = useStudentsStore();
const { getStudents, getPreviousSchool, getIsUpdatingDetails } = storeToRefs(studentsStore);

const route = useRoute();
const id = route.params.id;
const student = computed(() => getStudents.value.find(s => s.id === route.params.id));
// const IMG_URL = `https://lasms.proficiosoftware.com/documents/${route.params.id}/`;

const userStore = useUserStore();

async function updateDetail(event) {
    await studentsStore.updateDetails(event, id);
    disabled.value = true;
}

watch(() => student.value, () => {
    const data = JSON.parse(student.value.previousSchool) || [];
    studentsStore.setPreviousSchool(data);
})

onMounted(() => {
    if (!getStudents.value.length) studentsStore.fetchStudents();
});
</script>

<template>
    <MainHeader title="Student details">
        <FilledButton v-if="userStore.getIsAdmin" @click="disabled = !disabled" :type="disabled ? 'primary' : 'danger'">
            <icon :icon="disabled ? 'material-symbols:edit' : 'material-symbols:person-edit-rounded'" /> {{ disabled ?
                'Edit details' :
                'Cancel' }}
        </FilledButton>
    </MainHeader>

    <form v-if="student" @submit.prevent="updateDetail" method="post" enctype="multipart/form-data"
        class="bg-white p-4 rounded-md grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

        <div class="col-span-full font-medium text-light-gray -mb-2">Student details</div>

        <InputField label="First name" name="firstName" v-model="student.firstName" :disabled />
        <InputField label="Middle name" name="middleName" v-model="student.middleName" :disabled :required="false" />
        <InputField label="Last name" name="lastName" v-model="student.lastName" :disabled />

        <RadioGroup label="Gender" name="gender" v-model="student.gender" :disabled />

        <InputField label="Date of birth" name="dob" type="date" v-model="student.dob" :disabled />
        <InputField label="Aadhar number" name="aadhar" v-model="student.aadhar" :disabled />

        <div class="col-span-full font-medium text-light-gray -mb-2">Documents</div>

        <!-- documents -->
        <section class="flex flex-wrap justify-between col-span-full gap-4">
            <PhotoPicker class="max-w-48 aspect-[3/4]" message="Click to upload student photo" :url="student.photo"
                name="photo" :disabled />
            <PhotoPicker class="aspect-video flex-1" message="Click to upload Aadhar Front" :url="student.aadharFront"
                name="aadharFront" :disabled />
            <PhotoPicker class="aspect-video flex-1" message="Click to upload Aadhar Back" :url="student.aadharBack"
                name="aadharBack" :disabled />
        </section>

        <div class="col-span-full font-medium text-light-gray -mb-2">Contact details</div>

        <InputField label="Father's name" name="fatherName" v-model="student.fatherName" :disabled />
        <InputField label="Mother's name" name="motherName" v-model="student.motherName" :disabled :required="false" />
        <InputField label="Guardian's name" name="guardianName" v-model="student.guardianName" :disabled
            :required="false" />
        <InputField label="Email" name="email" type="email" v-model="student.email" :disabled :required="false" />
        <InputField label="Phone number" name="phone" type="tel" v-model="student.phone" :disabled />
        <InputField label="Alternate Phone number" name="phone2" type="tel" v-model="student.phone2" :disabled
            :required="false" />

        <div class="col-span-full grid gap-4 sm:grid-cols-2">
            <TextField label="Permanent Address" name="address" v-model="student.address" :disabled />
            <TextField label="Current Address" name="address2" v-model="student.address2" :disabled :required="false" />
        </div>

        <div class="col-span-full font-medium text-light-gray -mb-2">Academic details</div>

        <div class="flex justify-between col-span-full items-end">
            <SelectField label="Joining class" name="joiningClass" :options="classList" v-model="student.joiningClass"
                :disabled />

            <FilledButton v-if="!disabled" @click.prevent="studentsStore.addMoreSchool">
                <icon icon="material-symbols:add-notes-rounded" class="text-xl" /> Add more
            </FilledButton>
        </div>

        <hr class="border-secondary col-span-full">

        <div v-for="(item, index) in getPreviousSchool" :key="index" class="flex gap-4 items-end col-span-full">
            <SelectField class="flex-1" label="Previous class" v-model="item.class" :options="classList" :disabled />
            <InputField class="flex-1" label="School/College name" v-model="item.school" :disabled />
            <InputField class="flex-1" label="Passing year" v-model="item.passingYear" :disabled type="month" />
            <InputField class="flex-1" label="Percentage" v-model="item.percentage" :disabled type="number" max="100" />
            <FilledButton v-if="!disabled"  type="danger" class="h-10" @click.prevent="studentsStore.deleteSchool(index)">
                <icon icon="ph:trash-bold" />
            </FilledButton>
        </div>

        <div class="flex justify-between col-span-full mt-2">
            <FilledButton :disabled :isLoading="getIsUpdatingDetails">
                <icon icon="material-symbols:person-edit-rounded" class="text-xl" /> Update
            </FilledButton>
            <FilledButton v-if="!disabled" @click.prevent="disabled = true" type="danger">
                <icon icon="material-symbols:person-edit-rounded" class="text-xl" /> Cancel
            </FilledButton>
        </div>
    </form>
    <Loader v-else />
</template>