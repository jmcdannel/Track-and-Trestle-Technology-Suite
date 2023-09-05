<script setup lang="ts">
  import { onMounted } from 'vue'
  import { RouterView } from 'vue-router'
  import HeaderView from './views/HeaderView.vue'
  import FooterView from './views/FooterView.vue'
  import api from './api/api.ts'

  onMounted(async () => {
    try {
      // store.i
      await api.connect();
    } catch (err) {
      console.error(err);
    }
  });

</script>

<template>
  <main class="flex flex-col h-screen">
    <HeaderView />
    <main class="flex-grow flex mb-16">
      <RouterView />
    </main>
    <FooterView />
  </main>
</template>
