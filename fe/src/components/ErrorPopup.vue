
<script setup>
import { defineProps, defineEmits } from 'vue'
import { AlertCircleIcon, XIcon } from 'lucide-vue-next'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const closePopup = () => {
  emit('close')
}
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closePopup"></div>
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4 relative z-10">
        <div class="flex items-start mb-4">
          <div class="flex-shrink-0">
            <AlertCircleIcon class="h-6 w-6 text-red-500" />
          </div>
          <div class="ml-3 w-0 flex-1">
            <h3 class="text-lg font-medium text-gray-900">Error</h3>
            <p class="mt-1 text-sm text-gray-500 whitespace-pre-line">
              {{ message }}
            </p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="closePopup"
              class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <span class="sr-only">Close</span>
              <XIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
        <div class="mt-4">
          <button
            @click="closePopup"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>