<script setup lang="ts">  
  import { ref, onMounted } from 'vue';
  import { RouterLink } from 'vue-router'
  import api from '../api/api.ts'

  const locos:any = ref(null);

  const emit = defineEmits(['update:loco'])

  onMounted(async () => {
    console.log('[SelectLoco].onMounted');
    locos.value = await api.locos.get();
  });


  const selectLoco = async (e) => {
    console.log('SELECTLOCO.selectLoco', e.target.value);
    await emit('update:loco', { loco: parseInt(e.target.value) });
  }

</script>
<template>
  <main class="py-3 px-2 viaduct-background bg-opacity-50">
    <h2 class="[word-spacing: 90vw] placeholder:font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-purple-300 to-pink-600">
      Select
      Your
      <strong class="text-9xl uppercase">Loco</strong>
    </h2>
    <ul class="p-2 flex flex-col items-center" v-if="locos?.length > 0">
      <li class="mb-2" v-for="loco in locos" :key="loco._id">
        <!-- <button @click="selectLoco" :value="loco.address" class="btn bg-gradient-to-br from-orange-700 to-rose-500 text-white text-lg btn-wide btn-lg">
          {{loco.name}}
        </button> -->
        <!-- <RouterLink :to="`/throttle/${loco.address}`">{{loco.name}}</RouterLink> -->

        <router-link
          :to="`/throttle/${loco.address}`"
          custom
          v-slot="{ navigate }"
          
        >
          <button
            @click="navigate"
            role="link"
            class="btn bg-gradient-to-br from-orange-700 to-rose-500 text-white text-lg btn-wide btn-lg"
          >
          {{loco.name}}
          
          </button>
        </router-link>
      </li>
    </ul>
  </main>
</template>
