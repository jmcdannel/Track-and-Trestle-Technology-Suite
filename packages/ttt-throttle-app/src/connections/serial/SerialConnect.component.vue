<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useRoute } from 'vue-router'
  import { useConnectionStore } from '@/store/connectionStore'
  import ConnectionStatus from '@/core/ConnectionStatus.component.vue';
  import useSerial from '@/api/serialApi'

  const serialApi = useSerial()
  const { serialConnected } = storeToRefs(useConnectionStore())

  // const connection = computed(() => {
  //   return connections.value.get(connectionId)
  // });
  // const actionApiConnection = computed(() => {
  //   return connections.value.get('action-api')
  // });

  const handleConnectClick = async (e:any) => {
    try {
      e.preventDefault();
      serialApi.connect()
    } catch (err) {
      console.error(err);
    }
  }

  // watch(connection, (newVal, oldVal) => {
  //   console.log('[SerialConnect] watch', newVal, oldVal);
  //   if (newVal.connected && !oldVal?.connected) {
  //     // router.push({ name: 'home' });
  //     console.log('[SerialConnect] connected GO HOME', newVal, oldVal);
  //   }
  // });

  // watch(actionApiConnection, (newVal, oldVal) => {
  //   if (newVal.api && !oldVal?.api) {
  //     api.actionApi.put('ports', { });
  //   }
  // });

</script>

<template>
  <main class="p-4 flex flex-col justify-between w-full">
    <header>
      <h1 class="fancy-title leading-tight text-transparent text-8xl bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600">Connect</h1>
      <h2 class="text-5xl flex items-end ">
        <span class="text-3xl mr-4 bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600 bl">
          T<small class="text-xxs"></small> 
          & 
          T<small></small>
        </span> 
        <span class="bg-clip-text bg-gradient-to-r from-red-800 to-fuchsia-700 uppercase font-extrabold">
          Serial
        </span>
      </h2>
    </header>
    <main class="my-1 pt-8 flex-grow">  
      
      <div class="p-2 text-error">
        <ConnectionStatus :connected="serialConnected" />
      </div> 
      <div className="divider"></div> 
      <button class="btn btn-md btn-outline w-full border-teal-500" @click="handleConnectClick">Connect</button>
          
    </main>
  </main>
</template>

<style>

</style>
