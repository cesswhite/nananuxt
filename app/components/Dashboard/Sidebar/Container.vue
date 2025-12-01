<template>
    <UDashboardSidebar open collapsible resizable toggle-side="right" :ui="{ footer: 'border-t border-default' }">
        <template #header="{ collapsed }">
            <div class="flex items-center justify-between ? w-full">
                <AppLogo class="h-5 w-auto shrink-0" />
                <UDashboardSidebarCollapse />
            </div>
        </template>
        <template #default="{ collapsed }">
            <UNavigationMenu :collapsed="collapsed" :items="items[0]" orientation="vertical" />
        </template>
        <template #footer="{ collapsed }">
            <UButton :avatar="{
                src: 'https://d3ynb031qx3d1.cloudfront.net/general-demos/bg-6.png'
            }" :label="collapsed ? undefined : 'Paula White'" color="neutral" variant="ghost" class="w-full"
                :block="collapsed" />
        </template>
    </UDashboardSidebar>
</template>


<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[][] = [[
    {
        label: 'Images',
        icon: 'i-lucide-image',
        defaultOpen: true,
        children: [{
            label: 'Create',
            to: '/images/create'
        }, {
            label: 'Playground',
            to: '/images/playground'
        }, {
            label: 'Configure',
            to: '/images/configure'
        }]
    },
    {
        label: 'Videos',
        icon: 'i-lucide-inbox',
    },
    {
        label: 'Audio',
        icon: 'i-lucide-music'
    },
    {
        label: 'Settings',
        icon: 'i-lucide-settings'
    },
]]
</script>