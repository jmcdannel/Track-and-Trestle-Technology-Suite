<script setup lang="ts">
  import Title from '../core/Title.component.vue';
  import Power from '../core/Power.component.vue';
  import StatusMenu from '../core/StatusMenu.component.vue';
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import Favorites from '../core/Favorites.coponent.vue';
  import router from '../router/index.ts';
  import { useConfigStore } from '../store/configStore.tsx';

  // const configStore = useConfigStore();
  // const { layoutId } = storeToRefs(configStore);
  // const layoutConnected = ref(!!layoutId.value);
  // const layoutConnected = ref(false);

  // const showFavs = () => {
  //   const to = router?.currentRoute?.value?.name;
  //   const allowed = ['effects', 'throttle'];
  //   return layoutConnected.value && allowed.includes(to);
  // }

</script>

<template>
  <header>
    <div class="navbar bg-base-100">
      <div class="navbar-start">
       <Title />
      </div>
      <div class="navbar-end">
        <StatusMenu /> 
        <Power />
      </div>
    </div>
    <!-- <div class="navbar bg-base-100" v-if="showFavs()">
      <Favorites />
    </div> -->
  </header>
</template>
