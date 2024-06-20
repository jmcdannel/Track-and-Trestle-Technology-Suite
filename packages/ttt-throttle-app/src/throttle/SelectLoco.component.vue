<script setup lang="ts">  
  import { ref } from 'vue';
  import { RouterLink } from 'vue-router'
  import router from '../router';

  const locos:any = ref(['77', '03']);
  const loco = ref(null);

  const handleGoClick = async () => {
    console.log('SELECTLOCO.handleGoClick', loco.value);
    router.push({ name: 'throttle', params: { locoId: loco.value } })
    
  }

</script>
<template>
  <main class="py-3 px-2 viaduct-background bg-opacity-50">
    <h2 class="[word-spacing: 90vw] placeholder:font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-purple-300 to-pink-600">
      Select
      Your
      <strong class="text-9xl uppercase">Loco</strong>
    </h2>
    <div class="p-2 flex flex-row items-center justify-center">
      <input v-model="loco" class="text-black rounded p-2 text-xl w-auto">
      <button @click="handleGoClick" class="btn">GO</button>
    </div>
    <ul class="p-2 flex flex-col items-center" v-if="locos?.length > 0">
      <li class="mb-2" v-for="loco in locos" :key="loco">
        <router-link
          :to="`/throttle/${loco}`"
          custom
          v-slot="{ navigate }"          
        >
          <button
            @click="navigate"
            role="link"
            class="btn bg-gradient-to-br from-orange-700 to-rose-500 text-white text-lg btn-wide btn-lg"
          >
          {{loco}}          
          </button>
        </router-link>
      </li>
  </main>
</template>
