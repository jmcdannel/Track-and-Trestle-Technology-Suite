<script setup>
  import { ref } from 'vue'
  import { storeToRefs } from 'pinia';
  import { useConfigStore } from '../store/configStore.tsx';
  import dccJSApi from '../api/dccApi.ts';

  const configStore = useConfigStore();
  const { dccApi } = storeToRefs(configStore);

  const power = ref(false);

  async function handlePower() {
    try {
      console.log('handlePower',  power);
      await dccJSApi.setPower(power.value ? 0 : 1);
      power.value = !power.value;
    } catch (err) {
      console.error(err);
    }
  }

</script>

<template>

  <button @click="handlePower"
    :disabled="!dccApi?.connected"
    class="btn btn-ghost btn-circle relative"
    :class="{
      'text-gray-500': disabled,
      'text-success': !disabled && power,
      'text-error': !disabled && !power,  
    }">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
      </svg>
      <span class="w-1 h-1 bg-red-500 rounded-full absolute top-0.5"></span>
    </button>

</template>../api/dccApi.js