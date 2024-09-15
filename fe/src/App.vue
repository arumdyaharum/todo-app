<script setup>
import { useStore } from './stores/store.js';
import ErrorPopup from './components/ErrorPopup.vue';

const store = useStore();
</script>

<template>
  <ErrorPopup 
    :message="store.errorMessage" 
    :visible="store.isError" 
    @close="store.closeErrorPopup"
  />
  <RouterView />
</template>