<template>
    <div class="flex flex-col gap-4 ? h-full justify-center items-center">
        <div class="flex flex-col gap-4 ? w-full max-w-md ?">

            <UForm :validate="validate" :state="state" class="grid grid-cols-12 gap-4" @submit.prevent>
                <div class="col-span-full">
                    <UFormField label="Prompt" name="prompt" size="lg">
                        <UTextarea v-model="state.prompt" class="w-full" />
                    </UFormField>
                </div>
                <div class="col-span-full mt-4 flex gap-2">
                    <UButton block size="lg" class="cursor-pointer flex-1" :loading="loading" @click="generateImage">
                        Generate Image
                    </UButton>
                    <UButton block size="lg" class="cursor-pointer flex-1" :loading="loadingGpt"
                        @click="generateGptResponse">
                        Enhance Text
                    </UButton>
                </div>
                <div class="col-span-full">
                    <UButton block size="lg" class="cursor-pointer" :loading="loadingSurprise" @click="surpriseMe">
                        Surprise Me
                    </UButton>
                </div>
            </UForm>

            <div v-if="imageUrl" class="mt-4 relative">
                <UButton icon="i-lucide-x" size="sm" color="neutral" variant="solid" class="absolute top-2 right-2 z-10"
                    @click="clearImage" />
                <NuxtImg :src="imageUrl" alt="Generated image" class="rounded-lg shadow-lg max-w-full h-auto"
                    loading="lazy" />
            </div>

            <div v-if="gptResponse" class="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg relative">
                <UButton icon="i-lucide-x" size="sm" color="neutral" variant="solid" class="absolute top-2 right-2"
                    @click="clearGptResponse" />
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
const loadingSurprise = ref(false);
const error = ref<string | null>(null);


const state = reactive({
    prompt: undefined as string | undefined,
    aspect_ratio: undefined as string | undefined,
    output_format: undefined as string | undefined
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

    try {
        const response = await $fetch<{ output: string }>('/api/nanobanana', {
            method: 'POST',
            body: {
                prompt: state.prompt || "The most beautiful sunset in the world",
                aspect_ratio: state.aspect_ratio || "4:3",
                output_format: state.output_format || "png"
            }
        });

        imageUrl.value = response.output;

    } catch (err: any) {
        error.value = err.message || 'Error al generar la imagen';
        console.error('Error generating image:', err);
    } finally {
        loading.value = false;
    }
}

async function generateGptResponse() {
    loadingGpt.value = true;
    error.value = null;

    try {
        const response = await $fetch<{ success: boolean; data?: { text: string }; error?: string }>('/api/gpt5nano', {
            method: 'POST',
            body: {
                prompt: state.prompt || "Explain Bernoulli's principle",
                model: 'gpt-5-nano'
            }
        });

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
}

function clearImage() {
    imageUrl.value = null;
}

function clearGptResponse() {
    gptResponse.value = null;
}

async function surpriseMe() {
    loadingSurprise.value = true;
    error.value = null;

    try {
        const response = await $fetch<{ success: boolean; data?: { text: string }; error?: string }>('/api/surprise', {
            method: 'POST'
        });

        if (response.success && response.data) {
            state.prompt = response.data.text;
            // Automatically generate image with the surprise prompt
            await generateImage();
        } else {
            error.value = response.error || 'Error al generar el prompt';
        }

    } catch (err: any) {
        error.value = err.data?.error || err.message || 'Error al generar el prompt';
        console.error('Error generating surprise:', err);
    } finally {
        loadingSurprise.value = false;
    }
}
</script>
