<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useConnectionStore } from '@/connections/connectionStore.jsx'
  import { BsFillLightningChargeFill } from 'vue3-icons/bs'
  
  const { layoutId } = storeToRefs(useConnectionStore())
</script>
<template>
  <footer>
      
    <div class="btm-nav max-w-screen-md mx-auto">
      <span>
        <label v-if="layoutId" class="inline-flex text-xs bg-sky-800 text-white px-2 py-1 rounded-full items-center">
          [{{ layoutId }}]
          <BsFillLightningChargeFill class="w-3 h-3 fill-green-300 stroke-green-300" />
      </label>
      </span>
      <!-- <router-link
        to="/effects"
        custom
        v-slot="{ navigate }"
      >
        <button class="text-primary" :class="{ active: ($route?.name === 'effects') }" @click="navigate" role="link"></button>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        </button>
      </router-link> -->
      <!-- <router-link
        :to="`locos`"
        custom
        v-slot="{ navigate }"
      >
        <button class="text-primary" :class="{ active: ($route?.name === 'throttle' || $route?.name === 'locos') }" @click="navigate" role="link">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
          </svg>
        </button>
      </router-link> -->
      <!-- <router-link
        to="/turnouts"
        custom
        v-slot="{ navigate }"
      >
        <button class="text-primary" :class="{ active: ($route?.name === 'turnouts') }" @click="navigate" role="link">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
        </button>
      </router-link> -->
    </div>
  </footer>
</template>