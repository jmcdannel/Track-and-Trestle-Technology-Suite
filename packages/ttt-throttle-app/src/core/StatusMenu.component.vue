<script setup lang="ts">
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import ConnectionStatus from '../core/ConnectionStatus.component.vue';
  import router from '../router/index.ts';
  import { useConfigStore } from '../store/configStore.tsx';

  const configStore = useConfigStore();
  const { layoutId, layoutApi, dccApi } = storeToRefs(configStore);
  const layoutConnected = ref(!!layoutId.value);
  const dccConnected = ref(!!dccApi?.connected);
  const apiConnected = ref(!!layoutApi?.connected);

  function handleStatusClick (e:any) {
    console.log('handleStatusClick', e);
    router.push({ name: 'home' });
  }

  function allConnected() {
    const conn = (layoutConnected.value && dccConnected.value && apiConnected.value);
    // console.log('allConnected', conn, layoutConnected.value, dccConnected.value, apiConnected.value);
    return conn;
  }

  function allDisconnected() {
    const conn = !layoutConnected.value && !layoutApi?.connected && !dccApi?.connected;
    // console.log('allDisconnected', conn);
    return conn;
  }

  function anyConnected() {
    const conn = !allConnected() && (layoutConnected.value || !!layoutApi?.connected || !!dccApi?.connected);
    // console.log('anyConnected', conn);
    return conn;
  }

</script>

<template>
  <main>
        <button
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
      <section class="hidden">
        <!-- <Layout /> -->
        <ConnectionStatus 
          :connected="layoutConnected" 
          :connected-label="layoutId" 
          :disconnected-label="'Layout'" 
          @clear="handleStatusClick"
        />
        <ConnectionStatus 
          :connected="layoutApi?.connected" 
          :connected-label="''" 
          :disconnected-label="'API'" 
          @clear="handleStatusClick"
        />
        <ConnectionStatus 
          :connected="dccApi?.connected" 
          :connected-label="''" 
          :disconnected-label="'DCC'" 
          @clear="handleStatusClick"
        />
      </section>
</main>
</template>
