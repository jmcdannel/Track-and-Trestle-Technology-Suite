<script setup lang="ts">
  import LayoutIdStatus from './layout-id/LayoutIdStatus.component.vue';
  import DccExStatus from './dcc-ex/DccExStatus.component.vue';
  import SerialStatus from './serial/SerialStatus.component.vue';
  import EmulatorStatus from './emulator/EmulatorStatus.component.vue';
  import { useConnectionStore } from '@/store/connectionStore'
 
</script>

<template>
  <main class="py-3 px-4 pb-24 overflow-auto forest-background">
    <h2 class="mb-12 fancy-title leading-tight text-transparent text-2xl bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600">
      Connect
      Your
      <strong class="text-8xl font-extralight uppercase">Layout</strong>
    </h2>

    <LayoutIdStatus />
    <!-- <div class="divider"></div>
    <EmulatorStatus /> -->
    <div class="divider"></div>
    <DccExStatus />
    <div class="divider"></div>
    <SerialStatus /> 
    
  </main>
</template>

<style scoped>
  .fancy-title {
    word-spacing: 90vw; 
  }

  @media screen and (max-width: 640px) {
    .fancy-title {
      word-spacing: normal;
    }
  }
</style>./emulator/EmulatorStatus.component.vue
