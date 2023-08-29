<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { storeToRefs } from 'pinia';
  import LayoutApiStatus from './layout-api/LayoutApiStatus.component.vue';
  import DccExStatus from './dcc-ex/DccExStatus.component.vue';
  import SerialStatus from './serial/SerialStatus.component.vue';
  import EmulatorStatus from './emulator/EmulatorStatus.component.vue';
  import ActionApiStatus from './action-api/ActionApiStatus.component.vue';
  import api from '../api/api.ts';
  import { useConfigStore } from '../store/configStore.tsx';
  import { useConnectionStore } from '../store/connectionStore.jsx';

  const CONNECTION_ID = 'layoutApi';
  const configStore = useConfigStore();
  const connStore = useConnectionStore();
  const { layoutId, dccApi } = storeToRefs(configStore);
  const { connections } = storeToRefs(connStore);
  const interfaces:any = ref(null);


  const loadLayout = async (layoutId) => {
    const layout = await api.layouts.get(layoutId);
    console.log('loadLayout', layoutId, layout, layout?.interfaces);
    interfaces.value = layout?.interfaces;
  }

  onMounted(async () => {
    console.log('layoutId.value', layoutId.value);
    if (layoutId.value) {
      loadLayout(layoutId.value);
    }
  });


  watch(connStore.connections, (o, n) => {
    // this.connections.value = n;
    console.log('CONNECTIONS.WATCH', o, n);
  });


</script>

<template>
  <main class="py-3 px-4 pb-48 forest-background">
    <h2 class="mb-12 fancy-title leading-tight text-transparent text-2xl bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600">
      Connect
      Your
      <strong class="text-8xl font-extralight uppercase">Layout</strong>
    </h2>
    
    <LayoutApiStatus
      :connection="connections.find(el => el.connectionId === CONNECTION_ID)"  />
    <div class="divider"></div>
    <!-- <template v-for="conn in connections" :key="conn.connectionId">
      <pre>conn: {{ conn }}</pre>
    </template> -->
    <template v-for="iface in interfaces" :key="iface.id">
      <template v-if="iface.type === 'dcc-js-api'">
        <DccExStatus 
          :iface="iface" 
          :connection="connections.find(el => el.connectionId === iface.id)" 
        />
      </template>
      <template v-if="iface.type === 'action-api'">
        <div class="divider"></div>
        <ActionApiStatus 
          :iface="iface" 
          :connection="connections.find(el => el.connectionId === iface.id)" 
        /> 
      </template>
      <template v-if="iface.type === 'serial'">
        <div class="divider"></div>
        <SerialStatus :iface="iface" /> 
      </template>
    </template>

  </main>
</template>

<style scoped>
  .fancy-title {
    word-spacing: 90vw; 
  }

  @media screen and (max-width: 640px) {
    .fancy-title {
      word-spacing: normal;
    }
  }
</style>
