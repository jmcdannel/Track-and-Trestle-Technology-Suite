<script setup lang="ts">
import { storeToRefs } from 'pinia'
  import SelectConnections from '../connections/SelectConnections.component.vue'
  import ThrottleView from '../views/ThrottleView.vue'
  import { useConnectionStore } from '../store/connectionStore.jsx'

  const { dccExConnected, isEmulated } = storeToRefs(useConnectionStore())

</script>
<template>
  <main class="flex" v-if="dccExConnected || isEmulated">
    <ThrottleView />
  </main>
  <main class="flex" v-else>
    <SelectConnections /> 
  </main>
</template>
