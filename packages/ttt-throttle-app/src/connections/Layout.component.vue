<script setup lang="ts">
  import { store } from '../store/store.tsx';
  import router from '../router/index.ts';
  import api from '../api/api.ts';

  // const layoutId = ref(store.layoutId);

  async function clearLayoutId() {
    api.disconnect();
    store.layoutId = null;
    router.push('/');
  }

</script>

<template>
  <section class="layout-id flex flex-row items-center">
    <template v-if="store.layoutId">
      <button class="btn btn-ghost" @click="clearLayoutId">
        <span class="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
          <span class="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
          <span class="text-xs">{{ store.layoutId }}</span>
          <span class="w-3 h-3 rounded-full ml-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </span>
        </span>
      </button>
    </template>
    <template v-else>
      <span class="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
        <span class="w-2 h-2 mr-1 bg-red-500 rounded-full"></span>
        <span class="text-xs">Disconnected</span>
        <span class="w-3 h-3 rounded-full ml-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </span>
      </span>
    </template>
  </section>
</template>
