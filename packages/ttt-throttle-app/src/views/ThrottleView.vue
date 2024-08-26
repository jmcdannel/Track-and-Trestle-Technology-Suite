<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import Throttle from '@/throttle/Throttle.component.vue'
  import SelectLoco from '@/throttle/SelectLoco.component.vue'
  import { useThrottleStore, localStorageKey } from '@/throttle/throttleStore'

  import type { Loco } from '../throttle/types'

  const route = useRoute()

  const throttleStore = useThrottleStore()
  watch(() => throttleStore.$state?.locos,
    (state) => {
      localStorage.setItem(localStorageKey, JSON.stringify(state));
    },
    { deep: true }
  )
  
</script>

<template>
  <template v-if="route.params.locoId">
    <Throttle :locos="throttleStore.locos" :address="parseInt(route.params.locoId?.toString())" />
  </template>
  <template v-else>
    <SelectLoco :locos="throttleStore.locos" />
  </template>
</template>
