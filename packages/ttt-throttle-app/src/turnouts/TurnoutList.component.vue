<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import axios from "axios";
  import Turnout from './Turnout.component.vue'
  import { LAYOUT_ID } from '../constants.js';


  const turnouts = ref(null);

  onMounted(async () => {
    await getTurnouts();
  });

  async function getTurnouts() {
    try {
      const { data } = await axios.get(`/api/${LAYOUT_ID}/turnouts`);

      console.log('[TURNOUTLIST] data', data, data?.[0]?.turnouts);
      turnouts.value = data?.[0]?.turnouts;
    } catch (err) {
      console.error(err);
    }
  }

</script>
<template>
  <ul class="p-2" v-if="turnouts?.length > 0">
    <li class="mb-2" v-for="(trn, idx) in turnouts" :key="trn.turnoutId">
      <Turnout :turnout="turnouts[idx]"  />
    </li>
  </ul>
</template>
<style>

</style>
