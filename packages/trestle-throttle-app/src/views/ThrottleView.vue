<script setup lang="ts">
  import { ref } from 'vue';
  import MiniThrottle from '../throttle/MiniThrottle.component.vue'
  import dccApi from '../connections/dccApi.js';

  const power = ref(true)

  async function handlePower() {
    power.value = !power.value;
    console.log('handlePower',  power);
    dccApi.setPower(power.value ? 1 : 0);
  }

</script>

<template>
  <button class="btn bg-lime-600" @click="handlePower">Power</button>
  <MiniThrottle :address="31" />
</template>

<style>

</style>
