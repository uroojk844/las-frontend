<script setup lang="ts">
import MainHeader from '@/components/MainHeader.vue';
import InputField from '@/components/InputField.vue';
import FilledButton from '@/components/FilledButton.vue';
import RadioGroup from '@/components/RadioGroup.vue';
import TextField from '@/components/TextField.vue';
import SelectField from '@/components/SelectField.vue';
import PhotoPicker from '@/components/PhotoPicker.vue';
import CheckBoxGroup from '@/components/CheckBoxGroup.vue';
import Model from '@/components/Model.vue';

import { useStudentsStore } from '../../store/students';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import { useFeeStore } from '@/store/fee';

const studentsStore = useStudentsStore();
const { getPreviousSchool, classListOption, getStudentEnrolloment } = storeToRefs(studentsStore);

const feeStore = useFeeStore();
const { getFeeTypes } = storeToRefs(feeStore);

const fee_type_id = ref<number[]>([1, 2]);

const options = computed(() => getFeeTypes.value.map((fee) => {
    return {
        label: `${fee.name} fee`,
        value: fee.id,
    }
}));

const transport = ref(0)

watch(options, () => {
    if (options.value.length) options.value.pop();
}, { immediate: true })

const isOpen = ref(false);

watch(getStudentEnrolloment, () => {
    if (getStudentEnrolloment.value) {
        isOpen.value = true;
    }
});

onMounted(() => {
    studentsStore.fetchClassList();
    studentsStore.resetPreviousSchool();
    feeStore.fetchFeeTypes();
});
</script>

<template>
    <MainHeader title="Add Student"></MainHeader>

    <form @submit.prevent="studentsStore.addStudent($event, fee_type_id)"
        class="bg-surface p-4 rounded-md grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

        <div class="col-span-full font-medium text-light-gray -mb-2">Student details</div>

        <InputField label="First name" name="firstName" />
        <InputField label="Middle name" name="middleName" :required="false" />
        <InputField label="Last name" name="lastName" />
        <RadioGroup label="Gender" name="gender" />
        <InputField label="Date of birth" name="dob" type="date" />
        <InputField label="Aadhar number" name="aadhar" />

        <div class="col-span-full font-medium text-light-gray -mb-2">Documents</div>

        <section class="flex flex-wrap justify-between col-span-full gap-4">
            <PhotoPicker class="max-w-48 aspect-[3/4]" message="Click to upload student photo" name="photo" />
            <PhotoPicker class="aspect-video flex-1" message="Click to upload Aadhar Front" name="aadharFront" />
            <PhotoPicker class="aspect-video flex-1" message="Click to upload Aadhar Back" name="aadharBack" />
        </section>

        <div class="col-span-full font-medium text-light-gray -mb-2">Contact details</div>

        <InputField label="Father's name" name="fatherName" />
        <InputField label="Mother's name" name="motherName" :required="false" />
        <InputField label="Guardian's name" name="guardianName" :required="false" />
        <InputField label="Email" name="email" type="email" :required="false" />
        <InputField label="Phone number" name="phone" type="tel" />
        <InputField label="Alternate Phone number" name="phone2" type="tel" :required="false" />

        <div class="col-span-full grid gap-4 sm:grid-cols-2">
            <TextField label="Permanent Address" name="address" />
            <TextField label="Current Address" name="address2" :required="false" />
        </div>

        <div class="col-span-full font-medium text-light-gray -mb-2">Academic details</div>

        <SelectField label="Joining class" name="joiningClass" :options="classListOption" />

        <hr class="border-secondary col-span-full">

        <div v-for="(item, index) in getPreviousSchool" :key="index" class="contents">
            <SelectField label="Previous class" @change="(v) => item.class = v" :options="classListOption" />
            <InputField label="School/College name" v-model="item.school" />
            <InputField label="Passing year" v-model="item.passingYear" type="month" />
            <InputField label="Percentage" v-model="item.percentage" type="number" max="100" />
        </div>

        <div class="col-span-full font-medium text-light-gray -mb-2">Fee details</div>

        <CheckBoxGroup class="col-span-full" label="Select additional fee" v-model="fee_type_id" :options="options" />
        <RadioGroup class="col-span-full" label="Transport" name="transport" v-model="transport" :values="[
            {
                label: 'Yes',
                value: 1,
            },
            {
                label: 'No',
                value: 0,
            }
        ]" />
        <InputField label="Distance from school" name="distance" :required="!!transport" />

        <div class="col-span-full mt-2">
            <FilledButton>
                <icon icon="material-symbols:person-add-rounded" class="text-xl" /> Create
            </FilledButton>
        </div>
    </form>

    <Model v-model="isOpen" class="max-w-xl">
        <div class="grid place-items-center min-h-40">
            <h1 class="text-3xl">Admission successful!</h1>
            <div class="flex gap-2 items-center">
                <span class="text-xl font-medium">Student enrollment number is</span>
                <span
                    class="px-2 select-all py-1 border-2 text-sm border-green-600 border-dashed rounded-md bg-green-200">
                    {{ getStudentEnrolloment }}
                </span>
                <button @click="studentsStore.copyEnrollment"
                    class="px-3 py-1 bg-primary text-white flex items-center gap-1 rounded-md">
                    <icon icon="material-symbols:content-copy" /> Copy
                </button>
            </div>
            <FilledButton @click="isOpen = false">Close</FilledButton>
        </div>
    </Model>
</template>

<style scoped>
@reference "@/style.css";

.card {
    @apply block aspect-video border border-border rounded-md size-full object-cover object-center;
}

.card-placeholder {
    @apply grid place-items-center text-light-gray text-xl cursor-pointer hover:bg-secondary transition-colors aspect-video border-2 border-dashed border-border rounded-md;
}

.photo-placeholder {
    @apply size-full grid place-items-center text-center text-light-gray text-xl cursor-pointer hover:bg-secondary transition-colors border-2 border-dashed border-border rounded-md;
}
</style>