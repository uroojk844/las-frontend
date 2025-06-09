<script setup>
import MainHeader from '@/components/MainHeader.vue';
import InputField from '@/components/InputField.vue';
import FilledButton from '@/components/FilledButton.vue';
import RadioGroup from '@/components/RadioGroup.vue';
import TextField from '@/components/TextField.vue';
import SelectField from '@/components/SelectField.vue';
import PhotoPicker from '@/components/PhotoPicker.vue';
import { useStudentsStore } from '../../store/students';
import { storeToRefs } from 'pinia';

const classList = ['Nursury', 'LKG', 'UKG', '1', '2', 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const studentsStore = useStudentsStore();
const { getPreviousSchool } = storeToRefs(studentsStore);
</script>

<template>
    <MainHeader title="Add Student"></MainHeader>

    <form @submit.prevent="studentsStore.addStudent" method="post" enctype="multipart/form-data"
        class="bg-white p-4 rounded-md grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

        <div class="col-span-full font-medium text-light-gray -mb-2">Student details</div>

        <InputField label="First name" name="firstName" />
        <InputField label="Middle name" name="middleName" :required="false" />
        <InputField label="Last name" name="lastName" />
        <RadioGroup label="Gender" name="gender" />
        <InputField label="Date of birth" name="dob" type="date" />
        <InputField label="Aadhar number" name="aadhar" />

        <div class="col-span-full font-medium text-light-gray -mb-2">Documents</div>

        <!-- <section class="flex flex-wrap justify-between col-span-full gap-4">
            <div class="w-[189px] basis-[189px] aspect-[3/4]">
                <img v-if="photo" :src="photo"
                    class="object-cover object-center size-full border border-gray-200 rounded-md" />
                <label v-else for="photo" class="photo-placeholder">
                    Click to upload Student Photo
                </label>
                <input type="file" @change="createPreview" accept="image/*" class="hidden" name="photo" id="photo" />
            </div>
            <div class="flex-1 max-w-md min-w-72">
                <img v-if="aadharFront" :src="aadharFront" class="card" />
                <label v-else for="aadharFront" class="card-placeholder">
                    Click to upload Aadhar Front
                </label>
                <input type="file" @change="createPreview" accept="image/*" class="hidden" name="aadharFront"
                    id="aadharFront" />
            </div>
            <div class="flex-1 max-w-md min-w-72">
                <img v-if="aadharBack" :src="aadharBack" class="card" />
                <label v-else for="aadharBack" class="card-placeholder">
                    Click to upload Aadhar Back
                </label>
                <input type="file" @change="createPreview" accept="image/*" class="hidden" name="aadharBack"
                    id="aadharBack" />
            </div>
        </section> -->

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

        <SelectField label="Joining class" name="joiningClass" :options="classList" />

        <hr class="border-secondary col-span-full">

        <div v-for="(item, index) in getPreviousSchool" :key="index" class="contents">
            <SelectField label="Previous class" @change="(v) => item.class = v" :options="classList" />
            <InputField label="School/College name" v-model="item.school" />
            <InputField label="Passing year" v-model="item.passingYear" type="month" />
            <InputField label="Percentage" v-model="item.percentage" type="number" max="100" />
        </div>

        <div class="col-span-full mt-2">
            <FilledButton>
                <icon icon="material-symbols:person-add-rounded" class="text-xl" /> Create
            </FilledButton>
        </div>
    </form>
</template>

<style scoped>
@reference "@/style.css";

.card {
    @apply block aspect-video border border-gray-200 rounded-md size-full object-cover object-center;
}

.card-placeholder {
    @apply grid place-items-center text-light-gray text-xl cursor-pointer hover:bg-secondary transition-colors aspect-video border-2 border-dashed border-gray-200 rounded-md;
}

.photo-placeholder {
    @apply size-full grid place-items-center text-center text-light-gray text-xl cursor-pointer hover:bg-secondary transition-colors border-2 border-dashed border-gray-200 rounded-md;
}
</style>