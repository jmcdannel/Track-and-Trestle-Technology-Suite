<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useConnectionStore } from '../store/connectionStore'

  const { mqttConnected, serialConnected } = storeToRefs(useConnectionStore())

  function allConnected() {
    const conn = (mqttConnected.value && serialConnected.value)
    return conn
  }

  function allDisconnected() {
    const conn = !mqttConnected.value && !serialConnected.value
    return conn
  }

  function anyConnected() {
    const conn = !allConnected() && (mqttConnected.value || !!serialConnected.value)
    return conn
  }

</script>

<template>
  <main>
      <button
        @click="$router.push({ name: 'connect' })"
        class="btn btn-ghost btn-circle relative"
            :class="{
            'text-error': allDisconnected(),
            'text-success': allConnected(),
            'text-warning': anyConnected()
      }">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 mr-1">
        <path fill-rule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clip-rule="evenodd" />
      </svg>  
    </button>
</main>
</template>
