<script setup lang="ts">
  import SelectLayout from '../core/SelectLayout.component.vue'
  import api from '../api/api.ts';
  import router from '../router/index.ts';
  import { store } from '../store/store.tsx';

  const handleLayoutIdUpdated = async (newLayoutId:string) => {
    try {
      console.log('connectApi', newLayoutId, router);
      store.layoutId = newLayoutId;
      api.connect(newLayoutId);
      router.push(`/throttle`);
    } catch (err) {
      console.error(err);
    }
  }

  console.log('store.layoutId', store.layoutId);

</script>

<template>
  <main>
    <template v-if="!store.layoutId">
      <SelectLayout
        v-model="store.layoutId" 
        @update:layout-id="handleLayoutIdUpdated" />  
    </template>    
  </main>
</template>
