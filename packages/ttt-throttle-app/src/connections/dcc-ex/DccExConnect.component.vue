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

  const dccApi = computed(() => {
    return connections.value.get(connectionId)
  })

  onMounted(() => {
    api.dcc.send('listPorts', { });
  });

  const handlePortClick = async (e) => {
    try {
      e.preventDefault();
      const serial = e.target.value;
      console.log('handlePortClick', serial);
      await api.config.set(connectionId, serial);
      await api.dcc.send('connect', { serial });
      router.push({ name: 'home' });
    } catch (err) {
      console.error(err);
    }
  }

  watch(dccApi, (o, n) => {
    console.log('[DccExConnect].WATCH', o, n);
    if (n?.connected && !o?.connected) {
      api.dcc.send('listPorts', { });
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
          DCC EX
        </span>
      </h2>
    </header>
    <main class="my-1 pt-8 flex-grow">  
      
      <div class="p-2 text-error">
          <ConnectionStatus :connected="dccApi?.connected" />
          <!-- <pre>dccApi: {{ dccApi }}</pre>
          <pre>dccApi?.connected: {{ dccApi?.connected }}</pre> -->
        </div> 
        <div className="divider"></div> 
      <ul>
        <li v-for="port in dccApi?.ports" :key="port">
          <button class="btn btn-sm btn-outline w-full border-teal-500" :value="port" @click="handlePortClick">{{ port }}</button>
          <div className="divider"></div> 
        </li>
      </ul>
    </main>
  </main>
</template>

<style>

</style>
