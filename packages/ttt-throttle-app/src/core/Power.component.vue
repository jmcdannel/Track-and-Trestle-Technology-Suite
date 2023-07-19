<script setup>
  import { ref } from 'vue'
  import dccApi from '../connections/dccApi.js';

  const power = ref(false);

  async function handlePower() {
    try {
      console.log('handlePower',  power);
      await dccApi.setPower(power.value ? 0 : 1);
      power.value = !power.value;
    } catch (err) {
      console.error(err);
    }
  }

</script>

<template>

  <button @click="handlePower"
    class="btn btn-ghost btn-circle"
    :class="{
      'text-success': power,
      'text-error': !power,  
    }">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
      </svg>
    </button>

</template>