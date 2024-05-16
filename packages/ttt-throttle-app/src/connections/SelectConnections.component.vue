<script setup lang="ts">
  import DccExStatus from './dcc-ex/DccExStatus.component.vue';
  import SerialStatus from './serial/SerialStatus.component.vue';
</script>

<template>
  <main class="py-3 px-4 pb-48 forest-background">
    <h2 class="mb-12 fancy-title leading-tight text-transparent text-2xl bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600">
      Connect
      Your
      <strong class="text-8xl font-extralight uppercase">Layout</strong>
    </h2>

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
</style>
