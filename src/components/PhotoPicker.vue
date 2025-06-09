<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const IMG_URL = `https://lasms.proficiosoftware.com/documents/${route.params.id}/`;

defineProps({
    message: String,
    name: String,
    url: String,
    disabled: {
        type: Boolean,
        default: false,
    }
});

const preview = ref(null);

function createPreview(event) {
    const url = URL.createObjectURL(event.target.files[0]);
    preview.value = url;
}
</script>

<template>
    <div class="min-w-52 relative group">
        <img v-if="preview || url" :src="preview || IMG_URL + url" class="card" />
        <label :for="name" class="card-placeholder" :class="preview || url ? 'hidden' : 'grid'">
            {{ message }}
        </label>
        <input v-if="url && !preview" type="text" class="hidden" :name :value="url" />
        <input type="file" @change="createPreview" accept="image/*" class="hidden" :name :id="name" :disabled />
    </div>
</template>

<style scoped>
@reference "@/style.css";

.card {
    @apply block aspect-video border border-gray-200 rounded-md size-full object-cover object-center;
}

.card-placeholder {
    @apply size-full p-4 text-center place-items-center text-light-gray text-xl cursor-pointer hover:bg-secondary transition-colors border-2 border-dashed border-gray-200 rounded-md absolute top-0 left-0 group-hover:grid bg-white;
}
</style>