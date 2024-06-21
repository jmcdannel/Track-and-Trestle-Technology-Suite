<script setup lang="ts">  
  import { ref } from 'vue';
  import router from '@/router';

  const storedLocosData = localStorage.getItem('@DEJA/locos')
  const locos = ref(storedLocosData ? JSON.parse(storedLocosData) : [])
  const loco = ref(null)
  const MAX_SAVED_LOCOS = 20

  const handleGoClick = async () => {
    console.log('SELECTLOCO.handleGoClick', loco.value)
    const locoId = parseInt(loco.value)
    !!locoId && saveLoco(locoId)
    router.push({ name: 'throttle', params: { locoId } })
    
  }

  const navigate = (e:any) => {
    console.log('SELECTLOCO.navigate', e.target.value)
    const locoId = parseInt(e.target.value)
    !!locoId && saveLoco(locoId)
    !!locoId && router.push({ name: 'throttle', params: { locoId } })
  }

  const saveLoco = (loco:number) => {
    if (!locos.value.includes(loco)) {
      locos.value.push(loco);
      if (locos.value.length > MAX_SAVED_LOCOS) {
        locos.value.shift();
      }
      localStorage.setItem('@DEJA/locos', JSON.stringify(locos.value))
    }
  }

</script>
<template>  
  <main class="py-3 px-2 pb-24 overflow-auto viaduct-background bg-opacity-50">
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
          <button
            @click="navigate"
            role="link"
            :value="loco"
            class="btn bg-gradient-to-br from-orange-700 to-rose-500 text-white text-lg btn-wide btn-lg"
          >
          {{loco}}          
          </button>
      </li>
    </ul>
  </main>
</template>
