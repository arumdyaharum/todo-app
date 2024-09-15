<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { ChevronRightIcon, ChevronLeftIcon, InboxIcon, LogOutIcon } from 'lucide-vue-next'

  const router = useRouter()

  const isSideMenuOpen = ref(false)

  const toggleSideMenu = () => {
    isSideMenuOpen.value = !isSideMenuOpen.value
  }

  const doLogout = () => {
    localStorage.removeItem("access_token");
    router.push('/login')
  }
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
          isSideMenuOpen ? 'w-48' : 'w-0 md:w-48'
        ]"
      >
        <div class="p-4 space-y-4 h-full max-h-full flex flex-col justify-between">
          <div class="overflow-y-auto h-full">
            <a href="/" class="flex items-center space-x-2 text-sky-600">
              <InboxIcon />
              <span>Inbox</span>
            </a>
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
</template>