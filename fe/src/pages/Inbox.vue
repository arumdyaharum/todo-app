<script setup>
  import { ref, onBeforeMount, computed } from 'vue'
  import { PencilIcon, TrashIcon, CircleAlert, SearchIcon } from 'lucide-vue-next'
  import { useStore } from '../stores/store.js';

  const store = useStore();
  const todos = computed(() => store.todos);
  const projectName = computed(() => store.projectName);

  const newTodo = ref('')
  const isEditDialogOpen = ref(false)
  const editedTodoTitle = ref('')
  const editedTodoId = ref(null)
  const showSuggestions = ref(false)
  const searchQuery = ref('')

  const filteredSuggestions = computed(() => {
    const input = newTodo.value.toLowerCase()
    if (input.startsWith('/')) {
      return store.projects
        .filter(s => s.prefix.toLowerCase().startsWith(input))
        .filter((x, idx) => idx < 5);
    }
    return []
  })

  const filteredTodos = computed(() => {
    if (!searchQuery.value) return todos.value
    const query = searchQuery.value.toLowerCase()
    return todos.value.filter(todo => 
      todo.title.toLowerCase().includes(query) || 
      (todo.Project && todo.Project.name.toLowerCase().includes(query))
    )
  })

  const checkForSuggestions = () => {
    showSuggestions.value = newTodo.value.startsWith('/') && filteredSuggestions.value.length > 0
  }

  const applySuggestion = (suggestion) => {
    newTodo.value = suggestion.prefix
    showSuggestions.value = false
  }
  
  const addTodo = async () => {
    const regexTodo = newTodo.value.match(/^\/([\w+]+)\s+(.*)$/);
    if (regexTodo && regexTodo[2].trim()) {
      await store.createTodo(regexTodo[2].trim(), '/' + regexTodo[1].trim());
      newTodo.value = ''
    } else if (newTodo.value.trim()) {
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
  <div class="bg-gray-100 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <div class="sticky top-0 bg-gray-100 pb-1">
        <h1 class="text-2xl font-semibold text-gray-900 mb-6">{{projectName ? `${projectName} Project` : 'Inbox'}}</h1>
  
        <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <CircleAlert class="h-5 w-5 text-green-500" />
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-700">
                <span class="font-medium">Tip:</span> Type '/' before to-do to assign your to-do to the project
              </p>
              <p class="text-xs text-green-500 mt-1">
                The suggestion will show five recent projects but you can type others
              </p>
            </div>
          </div>
        </div>
  
        <div class="relative mb-4">
          <div class="flex">
            <input
              v-model="newTodo"
              type="text"
              placeholder="Add a new to-do"
              class="flex-grow px-4 py-2 text-gray-700 bg-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              @keyup.enter="addTodo"
              @input="checkForSuggestions"
            />
            <button
              @click="addTodo"
              class="px-4 py-2 bg-sky-500 text-white rounded-r-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              Create
            </button>
          </div>
    
          <!-- Suggestions -->
          <div v-if="showSuggestions" class="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
            <ul class="py-1">
              <li
                v-for="suggestion in filteredSuggestions"
                :key="suggestion.name"
                @click="applySuggestion(suggestion)"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {{ suggestion.name }}
              </li>
            </ul>
          </div>
        </div>
  
        <!-- Search Input -->
        <div class="mb-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search to-dos"
              class="w-full px-4 py-2 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <SearchIcon class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <ul class="space-y-3">
        <li v-for="todo in filteredTodos" :key="todo.id" class="flex items-center bg-white p-4 rounded-lg shadow-sm">
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="toggleTodo(todo)"
            class="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
          />
          <div class="ml-3 flex-grow">
            <div class="flex justify-between items-center w-full">
              <span :class="['text-gray-700', { 'line-through': todo.completed }]">
                {{ todo.title }}
              </span>
              <span
                v-if="todo.Project"
                class='px-2 py-1 text-xs font-medium rounded-full mr-2 bg-sky-100 text-sky-800 h-fit'
              >
                {{ todo.Project.name }}
              </span>
            </div>
          </div>
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