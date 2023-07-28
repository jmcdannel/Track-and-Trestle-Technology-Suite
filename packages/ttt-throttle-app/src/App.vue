<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import HeaderView from './views/HeaderView.vue'
  import FooterView from './views/FooterView.vue'
  import dccApi from './connections/dccApi.js'

  dccApi.connect();

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
