<script setup lang="ts">
import { Collapsable } from '@proj-airi/stage-ui/components'
import { Emotion, EmotionNeutralMotionName } from '@proj-airi/stage-ui/constants'
import { useSettings } from '@proj-airi/stage-ui/stores'
import { useFileDialog, useObjectUrl } from '@vueuse/core'
import JSZip from 'jszip'
import localforage from 'localforage'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const modelFile = useFileDialog({
  accept: 'application/zip',
})

const settings = useSettings()
const modelUrl = ref(settings.live2dModelUrl)

modelFile.onChange((files) => {
  if (files && files.length > 0) {
    settings.live2dMotionMap = {}
    settings.live2dModelFile = files[0]
    settings.live2dLoadSource = 'file'
    settings.loadingLive2dModel = true
  }
})

watch(() => settings.loadingLive2dModel, (value) => {
  if (value) {
    return
  }

  if (settings.live2dLoadSource !== 'file') {
    return
  }

  settings.availableLive2dMotions.forEach((motion) => {
    if (motion.motionName in Emotion) {
      settings.live2dMotionMap[motion.fileName] = motion.motionName
    }
    else {
      settings.live2dMotionMap[motion.fileName] = EmotionNeutralMotionName
    }
  })
})

async function patchMotionMap(source: File, motionMap: Record<string, string>): Promise<File> {
  if (!Object.keys(motionMap).length)
    return source

  const jsZip = new JSZip()
  const zip = await jsZip.loadAsync(source)
  const fileName = Object.keys(zip.files).find(key => key.endsWith('model3.json'))
  if (!fileName) {
    throw new Error('model3.json not found')
  }

  const model3Json = await zip.file(fileName)!.async('string')
  const model3JsonObject = JSON.parse(model3Json)

  const motions: Record<string, { File: string }[]> = {}
  Object.entries(motionMap).forEach(([key, value]) => {
    if (motions[value]) {
      motions[value].push({ File: key })
      return
    }
    motions[value] = [{ File: key }]
  })

  model3JsonObject.FileReferences.Motions = motions

  zip.file(fileName, JSON.stringify(model3JsonObject, null, 2))
  const zipBlob = await zip.generateAsync({ type: 'blob' })

  return new File([zipBlob], source.name, {
    type: source.type,
    lastModified: source.lastModified,
  })
}

async function saveMotionMap() {
  const fileFromIndexedDB = await localforage.getItem<File>('live2dModel')
  if (!fileFromIndexedDB) {
    return
  }

  const patchedFile = await patchMotionMap(fileFromIndexedDB, settings.live2dMotionMap)
  settings.live2dModelFile = patchedFile
  settings.live2dLoadSource = 'file'
  settings.loadingLive2dModel = true
}

const exportObjectUrl = useObjectUrl(settings.live2dModelFile)
</script>

<template>
  <div>
    <Collapsable w-full :default="true">
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
              i-solar:magic-stick-3-bold-duotone class="provider-icon size-6"
              transition="filter duration-250 ease-in-out"
            />
            <div>
              {{ t('settings.live2d.change-model.title') }}
            </div>
          </div>
          <div transform transition="transform duration-250" :class="{ 'rotate-180': slotProps.visible }">
            <div i-solar:alt-arrow-down-bold-duotone />
          </div>
        </button>
      </template>
      <div p-4>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-1 text-sm font-medium">
                {{ t('settings.live2d.change-model.from-url') }}
              </div>
            </div>
            <div>
              <input
                v-model="modelUrl"
                :disabled="settings.loadingLive2dModel"
                type="text"
                rounded
                border="zinc-300 dark:zinc-800 solid 1 focus:zinc-400 dark:focus:zinc-600"
                transition="border duration-250 ease-in-out"
                px-2 py-1 text-sm outline-none
                :placeholder="t('settings.live2d.change-model.from-url-placeholder')"
              >
              <button
                :disabled="settings.loadingLive2dModel"
                bg="zinc-100 dark:zinc-800"
                hover="bg-zinc-200 dark:bg-zinc-700"
                transition="all ease-in-out duration-250"
                ml-2 rounded px-2 py-1 text-sm outline-none
                @click="settings.live2dModelUrl = modelUrl"
              >
                {{ t('settings.live2d.change-model.from-url-confirm') }}
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-1 text-sm font-medium">
                {{ t('settings.live2d.change-model.from-file') }}
              </div>
            </div>
            <button
              :disabled="settings.loadingLive2dModel"
              rounded
              bg="zinc-100 dark:zinc-800"
              hover="bg-zinc-200 dark:bg-zinc-700"
              transition="all ease-in-out duration-250"
              px-2 py-1 text-sm outline-none
              @click="modelFile.open()"
            >
              {{ t('settings.live2d.change-model.from-file-select') }}
            </button>
          </div>
        </div>
      </div>
    </Collapsable>
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
              i-solar:face-scan-circle-bold-duotone class="provider-icon size-6"
              transition="filter duration-250 ease-in-out"
            />
            <div>
              Edit motion map
            </div>
          </div>
          <div transform transition="transform duration-250" :class="{ 'rotate-180': slotProps.visible }">
            <div i-solar:alt-arrow-down-bold-duotone />
          </div>
        </button>
      </template>
      <div p-4>
        <div v-if="settings.live2dLoadSource === 'file'" class="space-y-4">
          <div v-for="motion in settings.availableLive2dMotions" :key="motion.fileName" class="flex items-center justify-between">
            <div class="flex items-center gap-1 text-sm font-medium">
              {{ motion.fileName }}
            </div>

            <div flex gap-2>
              <select v-model="settings.live2dMotionMap[motion.fileName]">
                <option v-for="emotion in Object.keys(Emotion)" :key="emotion">
                  {{ emotion }}
                </option>
              </select>

              <button
                :disabled="settings.loadingLive2dModel"
                rounded
                bg="zinc-100 dark:zinc-800"
                hover="bg-zinc-200 dark:bg-zinc-700"
                transition="all ease-in-out duration-250"
                px-2 py-1 text-sm outline-none
                @click="settings.live2dCurrentMotion = { group: motion.motionName, index: motion.motionIndex }"
              >
                Play
              </button>
            </div>
          </div>
          <button
            :disabled="settings.loadingLive2dModel"
            w-full rounded
            bg="zinc-100 dark:zinc-800"
            hover="bg-zinc-200 dark:bg-zinc-700"
            transition="all ease-in-out duration-250"
            @click="saveMotionMap"
          >
            Save and patch
          </button>
          <a
            mt-2 block :href="exportObjectUrl"
            :download="`${settings.live2dModelFile?.name}-motion-edited.zip`"
          >
            <button
              :disabled="settings.loadingLive2dModel"
              w-full rounded
              bg="zinc-100 dark:zinc-800"
              hover="bg-zinc-200 dark:bg-zinc-700"
              transition="all ease-in-out duration-250"
            >
              Export
            </button>
          </a>
        </div>
        <div v-else>
          Not available for URL model
        </div>
      </div>
    </Collapsable>
  </div>
</template>
