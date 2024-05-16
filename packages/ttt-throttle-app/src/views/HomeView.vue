<script setup lang="ts">
import { storeToRefs } from 'pinia'
  import SelectConnections from '../connections/SelectConnections.component.vue'
  import ThrottleView from '../views/ThrottleView.vue'
  import { useConnectionStore } from '../store/connectionStore.jsx'

  const { serialConnected } = storeToRefs(useConnectionStore())

</script>
<template>
  <main class="flex" v-if="serialConnected">
    <ThrottleView />
  </main>
  <main class="flex" v-else>
    <SelectConnections /> 
  </main>
</template>
