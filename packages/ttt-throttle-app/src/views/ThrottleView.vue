<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import Throttle from '../throttle/Throttle.component.vue'
  import { useRoute } from 'vue-router'
  import router from '../router/index.ts';
  import api from '../api/api.ts'

  const route = useRoute();
  const loco = ref(null);
  const isMounted = ref(false);

  onMounted(async () => {
    try {
      const locoId = route.params.locoId
        ? route.params.locoId
        : api.config.loco.get();

      if (locoId) {
        await loadLoco(locoId);
      }
      
      console.log('loco', loco, loco.value);
      isMounted.value = true;
    } catch (err) {
      console.error(err);
    }
  });

  async function loadLoco(address:number) {
    await api.config.loco.set(address);
    const selectedLoco = await api.locos.get(address);
    console.log('loadLoco', selectedLoco);
    loco.value = selectedLoco;
  }

  function clearSelectedLoco()  {
    console.log('[ThrottleView].clearSelectedLoco');
    loco.value = null;
    api.config.loco.clear();
    router.push({ name: 'locos' });
  }

</script>

<template>
  <template v-if="isMounted">
    <Throttle v-if="loco" :loco="loco" @update:loco="clearSelectedLoco" />
  </template>
  <template v-else>
    <div>Loading...</div>
  </template>
</template>
