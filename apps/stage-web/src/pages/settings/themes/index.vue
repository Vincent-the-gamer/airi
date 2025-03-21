<script setup lang="ts">
import { Collapsable } from '@proj-airi/stage-ui/components'
import { DEFAULT_THEME_COLORS_HUE, useSettings } from '@proj-airi/stage-ui/stores'
import { useRouter } from 'vue-router'

const router = useRouter()
const settings = useSettings()

function resetToDefault() {
  settings.themeColorsHue = DEFAULT_THEME_COLORS_HUE
  settings.themeColorsHueDynamic = false
}
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
        Themes
      </div>
    </h1>
  </div>
  <Collapsable mt-4 w-full :default="true">
    <template #trigger="slotProps">
      <button
        bg="zinc-100 dark:zinc-800"
        hover="bg-zinc-200 dark:bg-zinc-700"
        transition="all ease-in-out duration-250"
        w-full flex items-center gap-1.5 rounded-lg px-4 py-3 outline-none
        class="[&_.provider-icon]:grayscale-100 [&_.provider-icon]:hover:grayscale-0"
        @click="slotProps.setVisible(!slotProps.visible)"
      >
        <div flex="~ row 1" items-center gap-1.5>
          <div
            i-solar:pallete-2-bold-duotone class="provider-icon size-6"
            transition="filter duration-250 ease-in-out"
          />
          <div>
            Colors
          </div>
        </div>
        <div transform transition="transform duration-250" :class="{ 'rotate-180': slotProps.visible }">
          <div i-solar:alt-arrow-down-bold-duotone />
        </div>
      </button>
    </template>
    <div p-4>
      <div class="flex items-center gap-8">
        <div class="flex items-center gap-1 text-sm font-medium">
          Primary color
        </div>

        <input
          v-model="settings.themeColorsHue"
          type="range"
          min="0"
          max="360"
          step="0.01"
          class="theme-hue-slider"
          :disabled="settings.themeColorsHueDynamic"
          :class="{ 'opacity-25 cursor-not-allowed': settings.themeColorsHueDynamic }"
        >
      </div>
      <div mt-4 h-10 w-full flex overflow-hidden rounded-lg>
        <div bg="primary-50" class="primary-color-bar" text-black>
          50
        </div>
        <div bg="primary-100" class="primary-color-bar" text-black>
          100
        </div>
        <div bg="primary-200" class="primary-color-bar" text-black>
          200
        </div>
        <div bg="primary-300" class="primary-color-bar" text-black>
          300
        </div>
        <div bg="primary-400" class="primary-color-bar" text-black>
          400
        </div>
        <div bg="primary-500" class="primary-color-bar" text-black>
          500
        </div>
        <div bg="primary-600" class="primary-color-bar" text-white>
          600
        </div>
        <div bg="primary-700" class="primary-color-bar" text-white>
          700
        </div>
        <div bg="primary-800" class="primary-color-bar" text-white>
          800
        </div>
        <div bg="primary-900" class="primary-color-bar" text-white>
          900
        </div>
        <div bg="primary-950" class="primary-color-bar" text-white>
          950
        </div>
      </div>

      <div mt-4 h-10 w-full flex overflow-hidden rounded-lg class="transparency-grid">
        <div bg="primary-500/5" class="primary-color-bar" text-black>
          500/5
        </div>
        <div bg="primary-500/10" class="primary-color-bar" text-black>
          500/10
        </div>
        <div bg="primary-500/20" class="primary-color-bar" text-black>
          500/20
        </div>
        <div bg="primary-500/30" class="primary-color-bar" text-black>
          500/30
        </div>
        <div bg="primary-500/40" class="primary-color-bar" text-black>
          500/40
        </div>
        <div bg="primary-500/50" class="primary-color-bar" text-black>
          500/50
        </div>
        <div bg="primary-500/60" class="primary-color-bar" text-black>
          500/60
        </div>
        <div bg="primary-500/70" class="primary-color-bar" text-black>
          500/70
        </div>
        <div bg="primary-500/80" class="primary-color-bar" text-black>
          500/80
        </div>
        <div bg="primary-500/90" class="primary-color-bar" text-black>
          500/90
        </div>
        <div bg="primary-500" class="primary-color-bar" text-black>
          500
        </div>
      </div>
      <div mt-4 class="flex items-center justify-end gap-4">
        <label class="relative inline-flex cursor-pointer items-center">
          <input
            v-model="settings.themeColorsHueDynamic"
            type="checkbox"
            class="peer sr-only"
          >
          <div
            class="peer-checked:bg-primary-500 h-6 w-11 rounded-full bg-neutral-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white dark:bg-neutral-600 after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"
          />
          <span class="ml-2 text-sm font-medium">I Want It Dynamic!</span>
        </label>

        <button
          class="rounded-md bg-neutral-100 px-3 py-1.5 text-sm transition-colors dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          @click="resetToDefault"
        >
          Reset to Default
        </button>
      </div>
    </div>
  </Collapsable>
  <div fixed bottom-0 right-0 z--1 text="neutral-100/80 dark:neutral-500/20">
    <div text="40" i-lucide:paintbrush translate-x-10 translate-y-10 />
  </div>
</template>

<style>
.primary-color-bar {
  @apply w-full h-full flex-1 flex items-center justify-center;
}

.theme-hue-slider {
  @apply flex-1 w-32 h-2 rounded-full appearance-none;
  background: linear-gradient(
    to right,
    oklch(85% 0.2 0),
    oklch(85% 0.2 60),
    oklch(85% 0.2 120),
    oklch(85% 0.2 180),
    oklch(85% 0.2 240),
    oklch(85% 0.2 300),
    oklch(85% 0.2 360)
  );
}

.transparency-grid {
  background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 20px 20px;
  background-position:
    0 0,
    0 10px,
    10px -10px,
    -10px 0px;
  background-color: #fff;
}
</style>

<route lang="yaml">
meta:
  stageTransition:
    name: slide
</route>
