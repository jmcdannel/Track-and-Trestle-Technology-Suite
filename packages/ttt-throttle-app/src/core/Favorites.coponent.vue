<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import axios from "axios";
  import FavoriteTurnout from '../turnouts/FavoriteTurnout.component.vue'
  import { LAYOUT_ID } from '../constants.js';


  const turnouts = ref(null);

  onMounted(async () => {
    await getTurnouts();
  });

  async function getTurnouts() {
    try {
      const { data } = await axios.get(`/api/${LAYOUT_ID}/turnouts`);

      console.log('[TURNOUTLIST] data', data, data?.[0]?.turnouts);
      turnouts.value = data?.[0]?.turnouts.filter(t => t.config?.type === 'kato');
    } catch (err) {
      console.error(err);
    }
  }

</script>
<template>
  <main class="flex flex-grow flex-row p-2 bg-gradient-to-r from-cyan-900 to-blue-900" v-if="turnouts?.length > 0">
    <template v-for="(trn, idx) in turnouts" :key="trn.turnoutId">
      <FavoriteTurnout :turnout="turnouts?.[idx]"  />
    </template>
  </main>
</template>
<style>

</style>
