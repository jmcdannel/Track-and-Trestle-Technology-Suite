<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { RouterView } from 'vue-router'
  import HeaderView from '@/views/HeaderView.vue'
  import FooterView from '@/views/FooterView.vue'
  import DEJAConnect from '@/core/DEJAConnect.component.vue'
  import { useConnectionStore } from '@/store/connectionStore'
  
  const conn = useConnectionStore()
  const { layoutId } = storeToRefs(conn)
  
</script>

<template>
  <template v-if="layoutId">
    <DEJAConnect />
  </template>
  <main class="flex flex-col h-screen">
    <HeaderView />
    <main class="flex-grow flex mb-16 min-h-0">
      <RouterView />
    </main>
    <FooterView />
  </main>
</template>
