
<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  project: {
    type: Object,
    default: () => ({ name: '', icon: 'FolderIcon' })
  },
  submitButtonText: {
    type: String,
    default: 'Submit'
  },
  idPrefix: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['submit', 'cancel']);

const projectName = ref(props.project.name);

watch(() => props.project, (newProject) => {
  projectName.value = newProject.name;
}, { deep: true });

const handleSubmit = () => {
  emit('submit', {
    name: projectName.value,
  });
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-4">
      <label :for="idPrefix + 'ProjectName'" class="block text-sm font-medium text-gray-700">Project Name</label>
      <input
        :id="idPrefix + 'ProjectName'"
        v-model="projectName"
        type="text"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50"
      />
    </div>
    <div class="flex justify-end space-x-2">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
      >
        {{ submitButtonText }}
      </button>
    </div>
  </form>
</template>