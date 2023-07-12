<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import axios from "axios";
  import { LAYOUT_ID } from '../constants.js';


  const destinations = ref(null);

  onMounted(async () => {
    await getRoutes();
  });

  async function getRoutes() {
    try {
      const { data } = await axios.get(`/api/${LAYOUT_ID}/routes`);

      console.log('data', data, data?.[0]?.routes);
      destinations.value = data?.[0]?.destinations;
    } catch (err) {
      console.error(err);
    }
  }

</script>
<template>
  <ul class="p-2" v-if="destinations?.length > 0">
    <li class="mb-2" v-for="(rte, idx) in destinations" :key="rte.routeId">
      <button class="btn">{{rte.name}}</button>
    </li>
  </ul>
</template>
<style>

</style>
