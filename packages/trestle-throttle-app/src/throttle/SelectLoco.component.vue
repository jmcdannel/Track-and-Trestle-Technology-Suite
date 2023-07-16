<script setup lang="ts">  
  import api from '../api/api.ts'
  import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router'

  const locos:any = ref(null);

  onMounted(async () => {
    console.log('[SelectLayout]].onMounted');
    locos.value = await api.locos.get();
    console.log('locos.value', locos.value);
  });
  

</script>

<template>
  <main class="py-3 px-2">
    <h2 class="[word-spacing: 90vw] placeholder:font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-purple-300 to-pink-600">
      Select
      Your
      <strong class="text-9xl uppercase">Loco</strong>
    </h2>
    <ul class="p-2 flex flex-col items-center" v-if="locos?.length > 0">
      <li class="mb-2" v-for="loco in locos" :key="loco._id">
        <RouterLink :to="`/throttle/${loco.address}`"
          class="btn bg-gradient-to-br from-orange-500 to-emerald-700 text-white text-lg btn-wide btn-lg"
          >{{loco.name}}</RouterLink>
      </li>
    </ul>
  </main>
</template>

<style scoped>
</style>
