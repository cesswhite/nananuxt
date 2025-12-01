<template>
    <div class="flex flex-col gap-4 ? h-full justify-center items-center">
        <div class="flex flex-col gap-4 ? w-full max-w-md ?">

            <UForm v-if="!imageUrl && !gptResponse" :validate="validate" :state="state" class="grid grid-cols-12 gap-4"
                @submit="generateImage">
                <div class="col-span-full">
                    <UFormField label="Prompt" name="prompt" size="lg">
                        <UTextarea v-model="state.prompt" type="password" class="w-full" />
                    </UFormField>
                </div>
                <div class="col-span-full mt-4 flex gap-2">
                    <UButton block type="submit" size="lg" class="cursor-pointer flex-1" :loading="loading">
                        Generate Image
                    </UButton>
                    <UButton block size="lg" class="cursor-pointer flex-1" :loading="loadingGpt"
                        @click="generateGptResponse">
                        GPT-5-Nano
                    </UButton>
                </div>
            </UForm>


            <div v-if="imageUrl" class="mt-4">
                <NuxtImg :src="imageUrl" alt="Generated image" class="rounded-lg shadow-lg max-w-full h-auto"
                    loading="lazy" />
            </div>

            <div v-if="gptResponse" class="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h3 class="font-semibold mb-2">GPT-5-Nano Response:</h3>
                <p class="whitespace-pre-wrap">{{ gptResponse }}</p>
            </div>

            <UAlert v-if="error" color="error" variant="soft" :title="error" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const imageUrl = ref<string | null>(null);
const gptResponse = ref<string | null>(null);
const loading = ref(false);
const loadingGpt = ref(false);
const error = ref<string | null>(null);


const state = reactive({
    prompt: undefined,
    aspect_ratio: undefined,
    output_format: undefined
})

const validate = (state: any): FormError[] => {
    const errors = []
    if (!state.email) errors.push({ name: 'email', message: 'Field required' })
    if (!state.password) errors.push({ name: 'password', message: 'Field required' })
    return errors
}

async function generateImage() {
    loading.value = true;
    error.value = null;
    imageUrl.value = null;
    gptResponse.value = null;

    try {
        const response = await $fetch<{ output: string }>('/api/nanobanana', {
            method: 'POST',
            body: {
                prompt: state.prompt || "The most beautiful sunset in the world",
                aspect_ratio: state.aspect_ratio || "4:3",
                output_format: state.output_format || "png"
            }
        });

        console.log(response);

        imageUrl.value = response.output;

    } catch (err: any) {
        error.value = err.message || 'Error al generar la imagen';
        console.error('Error generating image:', err);
    } finally {
        loading.value = false;
    }
};

async function generateGptResponse() {
    loadingGpt.value = true;
    error.value = null;
    gptResponse.value = null;
    imageUrl.value = null;

    try {
        const response = await $fetch<{ success: boolean; data?: { text: string }; error?: string }>('/api/gpt5nano', {
            method: 'POST',
            body: {
                prompt: state.prompt || "Explain Bernoulli's principle",
                model: 'gpt-5-nano'
            }
        });

        console.log(response);

        if (response.success && response.data) {
            gptResponse.value = response.data.text;
        } else {
            error.value = response.error || 'Error al generar la respuesta';
        }

    } catch (err: any) {
        error.value = err.data?.error || err.message || 'Error al generar la respuesta';
        console.error('Error generating GPT response:', err);
    } finally {
        loadingGpt.value = false;
    }
};
</script>
