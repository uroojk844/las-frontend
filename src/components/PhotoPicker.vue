<script setup lang="ts">
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

const preview = ref<string | undefined>(undefined);

function createPreview(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const url = URL.createObjectURL(file);
        preview.value = url;
    }
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
    @apply block aspect-video border border-border rounded-md size-full object-cover object-center;
}

.card-placeholder {
    @apply size-full p-4 text-center place-items-center text-light-gray text-xl cursor-pointer hover:bg-secondary transition-colors border-2 border-dashed border-border rounded-md absolute top-0 left-0 group-hover:grid bg-surface;
}
</style>