<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useConnectionStore } from '@/connections/connectionStore.jsx'
  import { BsFillLightningChargeFill } from 'vue3-icons/bs'

  const { mqttConnected, dejaConnected, isEmulated, serialConnected, layoutId } = storeToRefs(useConnectionStore())

  function emulated() {
    console.log(isEmulated.value)
    return isEmulated.value
  }

  function anyConnected() {
    const conn = isEmulated.value || dejaConnected.value || serialConnected.value
    return conn
  }

  function getLabel() {
    return serialConnected.value
      ? 'Serial'
      : dejaConnected.value
        ? `DEJA.js`
        : isEmulated.value
          ? 'Emulated'
          : ''
  }

</script>

<template>
  <main class="flex">
    <button
      @click="$router.push({ name: 'connect' })"
      class="btn btn-ghost relative flex flex-row"
          :class="{
          'text-blue-500': emulated(),
          'text-error': !anyConnected(),
          'text-green-300': anyConnected()
      }">
      <span class="">{{ getLabel() }}</span>
      <BsFillLightningChargeFill class="w-4 h-4 fill-green-300 stroke-green-300" />
    </button>
  </main>
</template>
