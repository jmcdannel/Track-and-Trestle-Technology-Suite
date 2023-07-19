<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { RouterView } from 'vue-router'
  import HeaderView from './views/HeaderView.vue'
  import FooterView from './views/FooterView.vue'
  import SelectLayout from './views/SelectLayout.vue'
  import dccApi from './connections/dccApi.js'
  import api from './api/api.ts';

  dccApi.connect();
  console.log('api.layoutId', api.getLayoutId());

  const layoutId = ref(api.getLayoutId());
  const layouts:any = ref(null);

  onMounted(async () => {
    console.log('[App].onMounted');
    layoutId.value && api.connect(layoutId.value);
    
    layouts.value = await api.layouts.get();
  });

  const handleLayoutIdUpdated = async (newLayoutId:string) => {
    console.log('handleLayoutIdUpdated', newLayoutId);
    api.connect(newLayoutId);
    // await localStorage.setItem('layoutId', newLayoutId);
    layoutId.value = newLayoutId;
  }

  const clearLayoutId = async () => {
    console.log('clearLayoutId');
    await localStorage.removeItem('layoutId');
    layoutId.value = null;
  }

</script>

<template>
  <main class="flex flex-col h-screen">
    <HeaderView />
    <main class="flex-grow flex mb-16">
      <RouterView v-if="layoutId" />
      <SelectLayout v-else :layouts="layouts" v-model="layoutId" @update:layout-id="handleLayoutIdUpdated" />  
    </main>
    <FooterView />
    <!-- <footer>
      <section class="layout-id flex flex-row items-center px-3 py-1">
        <div class="badge badge-primary mr-2">{{ layoutId  }}</div>
        <button class="btn btn-circle btn-outline btn-xs" @click="clearLayoutId">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </section>
    </footer> -->
  </main>
</template>

<style scoped>

</style>
