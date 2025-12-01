<template>
    <UDashboardPanel id="images-create">
        <template #header>
            <UDashboardNavbar title="Create Image" :ui="{ right: 'gap-3' }">
            </UDashboardNavbar>
        </template>

        <template #body>
            <DashboardImagesCreateContainer />
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">

useSeoMeta({
    title: 'Create',
    description: 'Create a new image'
})

</script>
