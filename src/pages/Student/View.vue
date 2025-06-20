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
import PhotoPicker from '@/components/PhotoPicker.vue';
import CheckBoxGroup from '@/components/CheckBoxGroup.vue';
import { useFeeStore } from '@/store/fee';

const disabled = ref(true)

const studentsStore = useStudentsStore();
const { getStudent, getPreviousSchool, getIsUpdatingDetails, classListOption } = storeToRefs(studentsStore);

const feeStore = useFeeStore();
const { getFeeTypes } = storeToRefs(feeStore)

const route = useRoute();
const id = route.params.id;

const userStore = useUserStore();

const options = computed(() => getFeeTypes.value.map((fee) => {
    return {
        label: `${fee.name} fee`,
        value: fee.id,
    }
}));
const fee_type_id = ref([]);

async function updateDetail(event) {
    await studentsStore.updateDetails(event, fee_type_id.value);
    disabled.value = true;
}

watch(getStudent, () => {
    fee_type_id.value = JSON.parse(getStudent.value.fee_type_id);
})

onMounted(() => {
    studentsStore.fetchStudentById(id);
    feeStore.fetchFeeTypes();
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

    <form v-if="getStudent" @submit.prevent="updateDetail" method="post" enctype="multipart/form-data"
        class="bg-white p-4 rounded-md grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

        <div class="col-span-full font-medium text-light-gray -mb-2">Student details</div>

        <input type="hidden" name="id" :value="getStudent.id" required />

        <InputField label="First name" name="firstName" v-model="getStudent.firstName" :disabled />
        <InputField label="Middle name" name="middleName" v-model="getStudent.middleName" :disabled :required="false" />
        <InputField label="Last name" name="lastName" v-model="getStudent.lastName" :disabled />

        <RadioGroup label="Gender" name="gender" v-model="getStudent.gender" :disabled />

        <InputField label="Date of birth" name="dob" type="date" v-model="getStudent.dob" :disabled />
        <InputField label="Aadhar number" name="aadhar" v-model="getStudent.aadhar" :disabled />
        <InputField label="Enrollment number" name="enrollment" v-model="getStudent.enrollment" disabled />

        <div class="col-span-full font-medium text-light-gray -mb-2">Fee details</div>

        <CheckBoxGroup class="col-span-full" label="Fee" v-model="fee_type_id" :options :disabled />
        <RadioGroup class="col-span-full" label="Transport" name="transport" v-model="getStudent.transport" :disabled
            :values="[
                {
                    label: 'Yes',
                    value: 1,
                },
                {
                    label: 'No',
                    value: 0,
                },
            ]" />
        <InputField label="Distance" name="distance" v-model="getStudent.distance" :required="getStudent.transport"
            :disabled />

        <div class="col-span-full font-medium text-light-gray -mb-2">Documents</div>

        <!-- documents -->
        <section class="flex flex-wrap justify-between col-span-full gap-4">
            <PhotoPicker class="max-w-48 aspect-[3/4]" message="Click to upload student photo" :url="getStudent.photo"
                name="photo" :disabled />
            <PhotoPicker class="aspect-video flex-1" message="Click to upload Aadhar Front"
                :url="getStudent.aadharFront" name="aadharFront" :disabled />
            <PhotoPicker class="aspect-video flex-1" message="Click to upload Aadhar Back" :url="getStudent.aadharBack"
                name="aadharBack" :disabled />
        </section>

        <div class="col-span-full font-medium text-light-gray -mb-2">Contact details</div>

        <InputField label="Father's name" name="fatherName" v-model="getStudent.fatherName" :disabled />
        <InputField label="Mother's name" name="motherName" v-model="getStudent.motherName" :disabled
            :required="false" />
        <InputField label="Guardian's name" name="guardianName" v-model="getStudent.guardianName" :disabled
            :required="false" />
        <InputField label="Email" name="email" type="email" v-model="getStudent.email" :disabled :required="false" />
        <InputField label="Phone number" name="phone" type="tel" v-model="getStudent.phone" :disabled />
        <InputField label="Alternate Phone number" name="phone2" type="tel" v-model="getStudent.phone2" :disabled
            :required="false" />

        <div class="col-span-full grid gap-4 sm:grid-cols-2">
            <TextField label="Permanent Address" name="address" v-model="getStudent.address" :disabled />
            <TextField label="Current Address" name="address2" v-model="getStudent.address2" :disabled
                :required="false" />
        </div>

        <div class="col-span-full font-medium text-light-gray -mb-2">Academic details</div>

        <div class="flex justify-between col-span-full items-end">
            <SelectField label="Joining class" name="joiningClass" :options="classListOption"
                v-model="getStudent.joiningClass" :disabled />

            <FilledButton v-if="!disabled" @click.prevent="studentsStore.addMoreSchool">
                <icon icon="material-symbols:add-notes-rounded" class="text-xl" /> Add more
            </FilledButton>
        </div>

        <hr class="border-secondary col-span-full">

        <div v-if="getPreviousSchool" v-for="(item, index) in getPreviousSchool" :key="index"
            class="grid gap-4 items-end grid-cols-[repeat(4,1fr)_auto] col-span-full">
            <SelectField label="Previous class" v-model="item.class" :options="classListOption" :disabled />
            <InputField label="School/College name" name="school" v-model="item.school" :disabled />
            <InputField label="Passing year" name="passingYear" v-model="item.passingYear" :disabled
                type="month" />
            <InputField label="Percentage" name="percentage" v-model="item.percentage" :disabled
                type="number" max="100" />
            <FilledButton v-if="!disabled" type="danger" class="h-10"
                @click.prevent="studentsStore.deleteSchool(index)">
                <icon icon="ph:trash-bold" />
            </FilledButton>
        </div>

        <div class="flex justify-between col-span-full mt-2" v-if="userStore.getIsAdmin">
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