<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import InterfaceList from '../connections/InterfaceList.component.vue'
  import axios from "axios";
  import { LAYOUT_ID } from '../constants.js';

  const layout = ref(null);

  onMounted(async () => {
    console.log('Home.onMounted');
    getLayout(LAYOUT_ID);
  });

  async function getLayout(layoutId:string) {
    try {
      const { data } = await axios.get(`/api/layouts/${layoutId}`);

      console.log('[LAYOUT] data', data);
      layout.value = data;
    } catch (err) {
      console.error(err);
    }
  }

</script>

<template>
  <main>
    <InterfaceList v-if="layout?.interfaces" :interfaces="layout?.interfaces" />
  </main>
</template>
