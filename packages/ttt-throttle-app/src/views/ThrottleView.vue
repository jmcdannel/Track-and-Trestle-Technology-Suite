<script setup lang="ts">
  import Throttle from '../throttle/Throttle.component.vue'
  import SelectLoco from '../throttle/SelectLoco.component.vue'
  import { useRoute } from 'vue-router'

  const route = useRoute();
  
</script>

<template>
  <template v-if="route.params.locoId">
    <Throttle />
  </template>
  <template v-else>
    <SelectLoco />
  </template>
</template>
