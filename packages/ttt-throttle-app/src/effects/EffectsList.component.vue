<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import axios from "axios";
  import Effect from '../effects/Effect.component.vue';
  import { LAYOUT_ID } from '../constants.js';


  const effects = ref(null);

  onMounted(async () => {
    console.log('AboutView.onMounted');
    getEffects(LAYOUT_ID);
  });

  async function getEffects(layoutId:string) {
    try {
      const { data } = await axios.get(`/api/${layoutId}/effects`);

      console.log('data', data, data?.[0]?.effects);
      effects.value = data?.[0]?.effects;
    } catch (err) {
      console.error(err);
    }
  }

</script>
<template>
  <ul class="p-2" v-if="effects?.length > 0">
    <li class="mb-2" v-for="(efx, idx) in effects" :key="efx.effectId">
      <Effect v-model:efx="effects[idx]" />
    </li>
  </ul>
</template>
<style>

</style>
