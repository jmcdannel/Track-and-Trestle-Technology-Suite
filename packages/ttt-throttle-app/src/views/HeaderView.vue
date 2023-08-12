<script setup lang="ts">
  import { ref } from 'vue';
  import Title from '../core/Title.component.vue';
  import Power from '../core/Power.component.vue';
  import Favorites from '../core/Favorites.coponent.vue';
  // import Layout from '../connections/Layout.component.vue';
  import router from '../router/index.ts';
  import { store } from '../store/store.tsx';

  const connections = ref(store.connections);
  console.log('HeaderView', router?.currentRoute.value.name, store.connections?.layoutApi?.url);
</script>

<template>
  <header>
    <div class="navbar bg-base-100">
      <div class="navbar-start">
       <Title />
      </div>
      <div class="navbar-end">
        <!-- <Layout /> -->
        <span>{{ connections?.layoutApi?.connected }}</span>
        <span>{{ connections?.layoutApi?.url }}</span>
        <Power />
      </div>
    </div>
    <section v-if="store.layoutId && router?.currentRoute?.value?.name !== 'turnouts'">
      <Favorites />
    </section>
  </header>
</template>
