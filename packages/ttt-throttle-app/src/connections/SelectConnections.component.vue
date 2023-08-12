<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { storeToRefs } from 'pinia';
  import LayoutApiStatus from './layout-api/LayoutApiStatus.component.vue';
  import DccExStatus from './dcc-ex/DccExStatus.component.vue';
  import EmulatorStatus from './emulator/EmulatorStatus.component.vue';
  import api from '../api/api.ts';
  import { useConfigStore } from '../store/configStore.tsx';

  const configStore = useConfigStore();
  const { connections, layoutId, layoutApi, dccApi } = storeToRefs(configStore);
  const interfaces:any = ref(null);


  const loadLayout = async (layoutId) => {
    const layout = await api.layouts.get(layoutId);
    console.log('loadLayout', layoutId, layout, layout?.interfaces);
    interfaces.value = layout?.interfaces;
  }

  onMounted(async () => {
    // connections.value = await api.config.getConnections();
    // console.log('connections', connections.value, store?.layoutId);
    layoutId && loadLayout(layoutId.value);
  });

  // watch(layoutId, loadLayout);

  // const connection = await configStore.getConnection('layoutApi');
  // console.log('connection', connection, layoutApi);

  // async function handleSelectLayout (e:any) {
  //   console.log('handleSelectLayout', e.target.value);
  //   await emit('update:layoutId', e.target.value);
  // }

  // const getConnection = async (connectionId) => {
  //   return await configStore.getConnection(connectionId);
  // }

</script>

<template>
  <main class="py-3 px-4 forest-background">
    <h2 class="mb-12 fancy-title leading-tight text-transparent text-2xl bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600">
      Connect
      Your
      <strong class="text-8xl font-extralight uppercase">Layout</strong>
    </h2>
    
    <LayoutApiStatus :connection="layoutApi" :statusLabel="layoutId" />
    <div class="divider"></div>
    <template v-for="iface in interfaces" :key="iface.id">
      <template v-if="iface.type === 'dcc-js-api'">
        <DccExStatus :connection="dccApi" :iface="iface" />
      </template>
      <template v-if="iface.type === 'action-api'">
        <div class="divider"></div>
        <EmulatorStatus /> 
      </template>
      <!-- <template v-if="iface.type === 'serial'">
        <div class="divider"></div>
        <EmulatorStatus /> 
      </template> -->
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
