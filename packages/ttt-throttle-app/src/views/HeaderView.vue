<script setup lang="ts">
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import Title from '../core/Title.component.vue';
  import Power from '../core/Power.component.vue';
  import Favorites from '../core/Favorites.coponent.vue';
  import ConnectionStatus from '../core/ConnectionStatus.component.vue';
  import router from '../router/index.ts';
  import { useConfigStore } from '../store/configStore.tsx';

  const configStore = useConfigStore();
  const { layoutId, layoutApi, dccApi } = storeToRefs(configStore);
  const layoutConnected = ref(!!layoutId);

  const showFavs = () => {
    const to = router?.currentRoute?.value?.name;
    const allowed = ['effects', 'throttle'];
    return layoutConnected.value && allowed.includes(to);
  }

</script>

<template>
  <header>
    <div class="navbar bg-base-100">
      <div class="navbar-start">
       <Title />
      </div>
      <div class="navbar-end">
        <!-- <Layout /> -->
        <ConnectionStatus 
          :connected="layoutConnected" 
          :connected-label="layoutId" 
          :disconnected-label="'Layout'" 
        />
        <ConnectionStatus 
          :connected="layoutApi?.connected" 
          :connected-label="'API'" 
          :disconnected-label="'API'" 
        />
        <ConnectionStatus 
          :connected="dccApi?.connected" 
          :connected-label="'DCC'" 
          :disconnected-label="'DCC'" 
        />
        <Power />
      </div>
    </div>
    <section v-if="showFavs()">
      <Favorites />
    </section>
  </header>
</template>
