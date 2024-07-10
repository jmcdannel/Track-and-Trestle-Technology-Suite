<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import LayoutIdStatus from './layout-id/LayoutIdStatus.component.vue';
  import Status from './Status.component.vue';
  import { useConnectionStore } from '@/store/connectionStore'
 
  const { isEmulated, dejaConnected, serialConnected } = storeToRefs(useConnectionStore())  
</script>
<template>    
    <main class="py-3 px-4 pb-24 overflow-auto forest-background">
      <h2 class="mb-12 fancy-title leading-tight text-transparent text-2xl bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600">
        Connect
        Your
        <strong class="text-8xl font-extralight uppercase">Layout</strong>
      </h2>

      <Transition name="slide-out" mode="out-in">
        <section class="flex flex-col">
          <Status :isConnected="dejaConnected" :connectPath="'/connect/deja'" :connectedLabel="'DEJA.js'" />
          <Status :isConnected="serialConnected" :connectPath="'/connect/serial'" :connectedLabel="'USB Serial'" />
          <Status :isConnected="isEmulated" :connectPath="'/connect/emulator'" :connectedLabel="'Emulator'" />
        </section>
      </Transition>
    </main>
</template>

<style scoped>
  .fancy-title {
    word-spacing: 90vw; 
  }

  .slide-out-enter-active, .slide-out-leave-active {
    transition: transform 0.5s;
  }
  .slide-out-enter-active {
    transform: translateX(100%);
  }
  .slide-out-enter-to {
    transform: translateX(0);
  }

  /* @media screen and (max-width: 640px) {
    .fancy-title {
      word-spacing: normal;
    }
  } */
</style>
