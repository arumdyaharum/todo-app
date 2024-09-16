<script setup>
  import { ref, computed, onBeforeMount } from 'vue'
  import { useRouter } from 'vue-router'
  import { ChevronRightIcon, ChevronLeftIcon, InboxIcon, LogOutIcon, FolderIcon, PlusIcon, PencilIcon, TrashIcon } from 'lucide-vue-next'
  import ProjectForm from '../components/ProjectForm.vue';
  import { useStore } from '../stores/store';

  const router = useRouter()
  const store = useStore()

  const isSideMenuOpen = ref(false)
  const isCreateProjectDialogOpen = ref(false)
  const newProjectName = ref('')
  const isEditProjectDialogOpen = ref(false)
  const isDeleteProjectDialogOpen = ref(false)
  const editingProject = ref({ id: null, name: '' })
  const deletingProject = ref({ id: null, name: '' })
  
  const projects = computed(() => store.projects);

  const toggleSideMenu = () => {
    isSideMenuOpen.value = !isSideMenuOpen.value
  }

  const openCreateProjectDialog = () => {
    isCreateProjectDialogOpen.value = true
  } 

  const closeCreateProjectDialog = () => {
    isCreateProjectDialogOpen.value = false
    newProjectName.value = ''
  }

  const createProject = (newProject) => {
    store.createProject(newProject.name);
    closeCreateProjectDialog()
  }

  const openEditProjectDialog = (project) => {
    editingProject.value = { ...project }
    isEditProjectDialogOpen.value = true
  }

  const closeEditProjectDialog = () => {
    isEditProjectDialogOpen.value = false
    editingProject.value = { id: null, name: '' }
  }

  const updateProject = (updatedProject) => {
    store.editProject(editingProject.value.id, updatedProject.name);
    closeEditProjectDialog()
  }

  const openDeleteProjectDialog = (project) => {
    deletingProject.value = { id: project.id, name: project.name }
    isDeleteProjectDialogOpen.value = true
  }

  const closeDeleteProjectDialog = () => {
    isDeleteProjectDialogOpen.value = false
    deletingProject.value = { id: null, name: '' }
  }

  const deleteProject = () => {
    store.deleteProject(deletingProject.value.id)
    closeDeleteProjectDialog()
  }

  const toProject = (project) => {
    store.getTodos(project.name)
    store.projectName = project.name
    store.projectId = project.id
    store.projectPrefix = project.prefix
  }

  const doLogout = () => {
    localStorage.removeItem("access_token");
    router.push('/login')
  }

  onBeforeMount(() => {
    store.getProjects();
  })
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden bg-gray-100">
    <header class="bg-sky-500 text-white p-4 flex justify-between items-center max-h-16">
      <h1 class="text-2xl font-bold">To-do App</h1>
      <button @click="toggleSideMenu" class="md:hidden">
        <ChevronRightIcon v-if="!isSideMenuOpen" />
        <ChevronLeftIcon v-else />
      </button>
    </header>

    <div class="flex flex-1 max-h-[calc(100vh-64px-56px)]">
      <nav
        :class="[
          'bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden',
          isSideMenuOpen ? 'w-64' : 'w-0 md:w-64'
        ]"
      >
        <div class="p-4 space-y-4 h-full max-h-full flex flex-col justify-between">
          <div class="overflow-y-auto h-full">
            <a href="/" class="flex items-center space-x-2 text-sky-600">
              <InboxIcon />
              <span>Inbox</span>
            </a>
            <div class="mt-5">
              <h2 class="font-semibold mb-2 flex justify-between items-center">
                <span>Projects</span>
                <button @click="openCreateProjectDialog" class="text-sky-600 hover:text-sky-700" aria-label="Create new project">
                  <PlusIcon />
                </button>
              </h2>
              <ul class="space-y-2">
                <li v-for="project in projects" :key="project.id" class="flex items-center justify-between">
                  <a @click="toProject(project)" class="flex items-center cursor-pointer space-x-2 text-gray-700 hover:text-sky-600">
                    <FolderIcon />
                    <span>{{ project.name }}</span>
                  </a>
                  <div class="flex space-x-1">
                    <button @click="openEditProjectDialog(project)" class="text-gray-500 hover:text-sky-600" aria-label="Edit project">
                      <PencilIcon class="w-4 h-4" />
                    </button>
                    <button @click="openDeleteProjectDialog(project)" class="text-gray-500 hover:text-red-600" aria-label="Delete project">
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <a @click="doLogout" class="cursor-pointer flex items-center space-x-2 text-sky-600">
              <LogOutIcon />
              <span>Log Out</span>
            </a>
          </div>
        </div>
      </nav>

      <main class="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-64px-56px)]">
        <RouterView />
      </main>
    </div>

    <footer class="bg-gray-200 p-4 text-center max-h-14">
      <p>&copy;arumdyaharum 2024</p>
    </footer>
  </div>

  <!-- Create Project Dialog -->
  <div v-if="isCreateProjectDialogOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4">Create New Project</h2>
      <ProjectForm
        :project="{ name: '', icon: 'FolderIcon' }"
        submit-button-text="Create"
        id-prefix="create"
        @submit="createProject"
        @cancel="closeCreateProjectDialog"
      />
    </div>
  </div>

  <!-- Edit Project Dialog -->
  <div v-if="isEditProjectDialogOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4">Edit Project</h2>
      <ProjectForm
        :project="editingProject"
        submit-button-text="Update"
        id-prefix="edit"
        @submit="updateProject"
        @cancel="closeEditProjectDialog"
      />
    </div>
  </div>

  <!-- Delete Project Dialog -->
  <div v-if="isDeleteProjectDialogOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4">Delete Project</h2>
      <p>Are you sure you want to delete the project "{{ deletingProject.name }}"?</p>
      <p class="mb-4">All of the to-dos inside this project will be deleted.</p>
      <div class="flex justify-end space-x-2">
        <button
          @click="closeDeleteProjectDialog"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          Cancel
        </button>
        <button
          @click="deleteProject"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>