<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import MiniThrottle from '../throttle/MiniThrottle.component.vue'
  import { useRoute } from 'vue-router'
  import api from '../api/api.ts'
  import dccApi from '../connections/dccApi.js';

  const route = useRoute()
  const power = ref(false);
  const loco = ref(null);

  onMounted(async () => {
    console.log('[ThrottleView].onMounted', route.params.locoId);
    loco.value = await api.locos.get(route.params.locoId);
  });

  async function handlePower() {
    power.value = !power.value;
    console.log('handlePower',  power);
    dccApi.setPower(power.value ? 1 : 0);
  }

</script>

<template>
  <button class="btn bg-lime-600" @click="handlePower">Power</button>
  <MiniThrottle v-if="loco" :loco="loco" />
</template>

<style>

</style>
