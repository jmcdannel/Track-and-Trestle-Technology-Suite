<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import router from '@/router';
  import ConnectionStatus from '@/core/ConnectionStatus.component.vue'
  import { useConnectionStore } from '@/store/connectionStore.jsx'

  const conn = useConnectionStore()
  const { isEmulated, dccExConnected } = storeToRefs(conn)

  const handleConnectClick = () => {
    isEmulated.value = true
    dccExConnected.value = false
    router.push({ name: 'home' })
  }
  const handleDisconnectClick = () => {
    isEmulated.value = false
  }

</script>

<template>
  <main class="p-4 flex flex-col justify-between w-full">
    <header>
      <h1 class="fancy-title leading-tight text-transparent text-8xl bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600">Connect</h1>
      <h2 class="text-5xl flex items-end ">
        <span class="text-3xl mr-4 bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600 bl">
          <small class="text-xxs">TTT</small> 
        </span> 
        <span class="bg-clip-text bg-gradient-to-r from-red-800 to-fuchsia-700 uppercase font-extrabold">
          Emulator
        </span>
      </h2>
    </header>
    <main class="my-1 pt-8 flex-grow">  
      <div class="p-2 text-error">
        <ConnectionStatus connectedLabel="Emulator" disconnectedLabel="Emulator" :connected="isEmulated" />
        <button v-if="isEmulated" class="btn btn-sm btn-outline  border-orange-500" @click="handleDisconnectClick">Disconnect</button>
        <button v-else class="btn btn-sm btn-outline  border-green-500" @click="handleConnectClick">Connect</button>
      </div>
    </main>
  </main>
</template>
