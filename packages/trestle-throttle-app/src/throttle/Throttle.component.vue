<script setup lang="ts">
  import { ref } from 'vue';

</script>

<template>
  <main>
    <header>
      
    </header>
    <section>
      
      <input type="range" orient="vertical" class="throttle-slider" />
    </section>
  </main>
</template>

<style scroped>

  .throttle-slider {
    writing-mode: bt-lr; /* IE */
    -webkit-appearance: slider-vertical; /* Chromium */
    width: 8px;
    height: 175px;
    padding: 0 5px;
  }

</style>