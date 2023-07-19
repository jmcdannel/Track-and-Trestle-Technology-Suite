<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import Throttle from '../throttle/Throttle.component.vue'
  import SelectLoco from '../throttle/SelectLoco.component.vue'
  import { useRoute } from 'vue-router'
  import api from '../api/api.ts'

  const route = useRoute();
  const loco = ref(null);
  const isMounted = ref(false);

  onMounted(async () => {
    try {
      const locoId = route.params.locoId
        ? route.params.locoId
        : api.getSelectedLocoId();

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
    const selectedLoco = await api.selectLoco(address);
    console.log('loadLoco', selectedLoco);
    loco.value = selectedLoco;
  }

  function clearSelectedLoco()  {
    console.log('[ThrottleView].clearSelectedLoco');
    loco.value = null;
  }

  function handleLocoSelected({ loco })  {
    console.log('[ThrottleView].handleLocoSelected', loco);
    loadLoco(loco);
  }

</script>

<template>
  <template v-if="isMounted">
    <Throttle v-if="loco" :loco="loco" @update:loco="clearSelectedLoco" />
    <SelectLoco v-else @update:loco="handleLocoSelected" />  
  </template>
  <template v-else>
    <div>Loading...</div>
  </template>
</template>
