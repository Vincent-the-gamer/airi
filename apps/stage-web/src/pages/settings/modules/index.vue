<script setup lang="ts">
import { IconStatusItem } from '@proj-airi/stage-ui/components'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Module {
  id: string
  name: string
  description: string
  icon?: string
  iconColor?: string
  iconImage?: string
  to: string
  configured: boolean
}

// TODO: categorize modules, such as essential, messaging, gaming, etc.
const modulesList = computed<Module[]>(() => [
  {
    id: 'consciousness',
    name: 'Consciousness',
    description: 'Thinking, vision, speech synthesis, gaming, etc.',
    icon: 'i-lucide:ghost',
    to: '/settings/modules/consciousness',
    configured: false,
  },
  // {
  //   id: 'hearing',
  //   name: 'Hearing',
  //   description: 'Hearing, speech recognition, etc.',
  //   icon: 'i-lucide:ear',
  //   to: '',
  //   configured: false,
  // },
  // {
  //   id: 'messaging-discord',
  //   name: 'Discord',
  //   description: 'Messaging, notifications, etc.',
  //   icon: 'i-simple-icons:discord',
  //   to: '',
  //   configured: false,
  // },
  {
    id: 'speech',
    name: 'Speech',
    description: 'Speech synthesis, etc.',
    icon: 'i-lucide:mic',
    to: '/settings/modules/speech',
    configured: false,
  },
  // {
  //   id: 'memory-short-term',
  //   name: 'Short-Term Memory',
  //   description: 'Short-term memory, etc.',
  //   icon: 'i-lucide:book',
  //   to: '',
  //   configured: false,
  // },
  // {
  //   id: 'memory-long-term',
  //   name: 'Long-Term Memory',
  //   description: 'Long-term memory, etc.',
  //   icon: 'i-lucide:book-copy',
  //   to: '',
  //   configured: false,
  // },
  // {
  //   id: 'vision',
  //   name: 'Vision',
  //   description: 'Vision, etc.',
  //   icon: 'i-lucide:eye',
  //   to: '',
  //   configured: false,
  // },
  // {
  //   id: 'game-minecraft',
  //   name: 'Minecraft',
  //   description: 'Playing Minecraft with you, etc.',
  //   iconColor: 'i-vscode-icons:file-type-minecraft',
  //   to: '',
  //   configured: false,
  // },
  // {
  //   id: 'game-factorio',
  //   name: 'Factorio',
  //   description: 'Playing Factorio with you, etc.',
  //   iconImage: FactorioIcon,
  //   to: '',
  //   configured: false,
  // },
])
</script>

<template>
  <div flex="~ row" items-center gap-2>
    <button @click="router.back()">
      <div i-solar:alt-arrow-left-line-duotone text-2xl />
    </button>
    <h1 relative>
      <div absolute left-0 top-0 translate-y="[-80%]">
        <span text="neutral-300 dark:neutral-500">Settings</span>
      </div>
      <div text-3xl font-semibold>
        Modules
      </div>
    </h1>
  </div>
  <div grid="~ cols-1 sm:cols-2 gap-4">
    <IconStatusItem
      v-for="module in modulesList"
      :key="module.id"
      :title="module.name"
      :description="module.description"
      :icon="module.icon"
      :icon-color="module.iconColor"
      :icon-image="module.iconImage"
      :to="module.to"
      :configured="module.configured"
    />
  </div>
  <div fixed bottom-0 right-0 z--1 text="neutral-100/80 dark:neutral-500/20">
    <div text="40" i-lucide:blocks translate-x-10 translate-y-10 />
  </div>
</template>

<route lang="yaml">
meta:
  stageTransition:
    name: slide
</route>
