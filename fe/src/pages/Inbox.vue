<script setup>
  import { ref, onBeforeMount, computed } from 'vue'
  import { useRouter } from 'vue-router';
  import { PencilIcon, TrashIcon } from 'lucide-vue-next'
  import { useStore } from '../stores/store.js';

  const router = useRouter()
  const store = useStore();
  const todos = computed(() => store.todos);

  const newTodo = ref('')
  const isEditDialogOpen = ref(false)
  const editedTodoTitle = ref('')
  const editedTodoId = ref(null)

  const addTodo = async () => {
    if (newTodo.value.trim()) {
      await store.createTodo(newTodo.value.trim());
      newTodo.value = ''
    }
  }

  const toggleTodo = (todo) => {
    store.changeCompleted(todo.id, !todo.completed);
  }

  const openEditDialog = (todo) => {
    editedTodoTitle.value = todo.title
    editedTodoId.value = todo.id
    isEditDialogOpen.value = true
  }

  const closeEditDialog = () => {
    isEditDialogOpen.value = false
    editedTodoTitle.value = ''
    editedTodoId.value = null
  }

  const saveEditedTodo = () => {
    if (editedTodoTitle.value.trim()) {
      store.editTodo(editedTodoId.value, editedTodoTitle.value)
      closeEditDialog()
    }
  }

  const deleteTodo = (todo) => {
    store.deleteTodo(todo.id);
  }

  onBeforeMount(() => {
    store.getTodos();
  })
</script>

<template>
  <div class="bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <h1 class="text-2xl font-semibold text-gray-900 mb-6">Inbox</h1>
      
      <div class="mb-4 flex">
        <input
          v-model="newTodo"
          type="text"
          placeholder="Add a new todo"
          class="flex-grow px-4 py-2 text-gray-700 bg-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          @keyup.enter="addTodo"
        />
        <button
          @click="addTodo"
          class="px-4 py-2 bg-sky-500 text-white rounded-r-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          Create
        </button>
      </div>
      
      <ul class="space-y-3">
        <li v-for="todo in todos" :key="todo.id" class="flex items-center bg-white p-4 rounded-lg shadow-sm">
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="toggleTodo(todo)"
            class="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
          />
          <span
            :class="['flex-grow', 'ml-3', 'text-gray-700', { 'line-through': todo.completed }]"
          >
            {{ todo.title }}
          </span>
          <button
            @click="openEditDialog(todo)"
            class="ml-2 text-gray-400 hover:text-sky-500 focus:outline-none"
          >
            <PencilIcon class="h-5 w-5" />
          </button>
          <button
            @click="deleteTodo(todo)"
            class="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
          >
            <TrashIcon class="h-5 w-5" />
          </button>
        </li>
      </ul>
    </div>
  </div>

  <!-- Edit Todo Dialog -->
  <teleport to="body">
    <div v-if="isEditDialogOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">Edit Todo</h2>
        <input
          v-model="editedTodoTitle"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <div class="mt-4 flex justify-end space-x-2">
          <button
            @click="closeEditDialog"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            Cancel
          </button>
          <button
            @click="saveEditedTodo"
            class="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>