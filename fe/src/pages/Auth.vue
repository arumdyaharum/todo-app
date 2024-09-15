<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from '../stores/store.js'
import ErrorPopup from '../components/ErrorPopup.vue'

const router = useRouter()
const store = useStore()

const isLogin = ref(true)
const name = ref('')
const email = ref('')
const password = ref('')

const toggleForm = () => {
  isLogin.value = !isLogin.value
  name.value = ''
  email.value = ''
  password.value = ''
}

const handleLogin = async () => {
  const isLogged = await store.doLogin(email.value, password.value);
  if (isLogged) {
    router.push('/');
  }
}

const handleRegister = async () => {
  const isRegistered = await store.doRegister(name.value, email.value, password.value)
  if (isRegistered) {
    toggleForm();
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <transition name="fade" mode="out-in">
        <div v-if="isLogin" key="login">
          <h2 class="text-2xl font-bold mb-4 text-sky-600">Login</h2>
          <form @submit.prevent="handleLogin">
            <input v-model="email" type="email" name="email" placeholder="Email" required class="w-full p-2 mb-4 border rounded" />
            <input v-model="password" type="password" name="password" placeholder="Password" required class="w-full p-2 mb-4 border rounded" />
            <button type="submit" class="w-full bg-sky-500 text-white p-2 rounded hover:bg-sky-600">Login</button>
          </form>
          <p class="mt-4 text-center">
            Don't have an account? 
            <a @click="toggleForm" class="text-sky-600 cursor-pointer">Register</a>
          </p>
        </div>
        <div v-else key="register">
          <h2 class="text-2xl font-bold mb-4 text-sky-600">Register</h2>
          <form @submit.prevent="handleRegister">
            <input v-model="name" type="text" placeholder="Name" required class="w-full p-2 mb-4 border rounded" />
            <input v-model="email" type="email" placeholder="Email" required class="w-full p-2 mb-4 border rounded" />
            <input v-model="password" type="password" placeholder="Password" required class="w-full p-2 mb-4 border rounded" />
            <button type="submit" class="w-full bg-sky-500 text-white p-2 rounded hover:bg-sky-600">Register</button>
          </form>
          <p class="mt-4 text-center">
            Already have an account? 
            <a @click="toggleForm" class="text-sky-600 cursor-pointer">Login</a>
          </p>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>