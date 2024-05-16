<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useRoute } from 'vue-router'
  import ConnectionStatus from '../../core/ConnectionStatus.component.vue';
  import router from '../../router/index.ts';
  import api from '../../api/api.ts';
  import { useConnectionStore } from '../../store/connectionStore.jsx';

  const route = useRoute();
  const connectionId = route.params.connectionId;

  const connStore = useConnectionStore();
  const { connections } = storeToRefs(connStore);

  const connection = computed(() => {
    return connections.value.get(connectionId)
  });
  const actionApiConnection = computed(() => {
    return connections.value.get('action-api')
  });

  onMounted(() => {
    api.actionApi.put('ports', { });
  });

  const handlePortClick = async (e) => {
    try {
      e.preventDefault();
      const serial = e.target.value;
      console.log('handlePortClick', serial, connectionId);
      // connStore.setConnection(connectionId, { serial, connected: false })
      await api.config.set(connectionId, serial);
      await api.actionApi.put('serialConnect', { connectionId, serial });
      // router.push({ name: 'home' });
    } catch (err) {
      console.error(err);
    }
  }

  watch(connection, (newVal, oldVal) => {
    console.log('[SerialConnect] watch', newVal, oldVal);
    if (newVal.connected && !oldVal?.connected) {
      // router.push({ name: 'home' });
      console.log('[SerialConnect] connected GO HOME', newVal, oldVal);
    }
  });

  watch(actionApiConnection, (newVal, oldVal) => {
    if (newVal.api && !oldVal?.api) {
      api.actionApi.put('ports', { });
    }
  });

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
          <ConnectionStatus :connected="connection?.connected" />
           <pre>connection: {{ connection }}</pre>
           <pre>actionApiConnection: {{ actionApiConnection }}</pre>
        </div> 
        <div className="divider"></div> 
      <ul>
        <li v-for="port in actionApiConnection?.ports" :key="port">
          <button class="btn btn-sm btn-outline w-full border-teal-500" :value="port" @click="handlePortClick">{{ port }}</button>
          <div className="divider"></div> 
        </li>
      </ul>
    </main>
  </main>
</template>

<style>

</style>
