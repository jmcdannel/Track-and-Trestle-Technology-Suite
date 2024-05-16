<script setup lang="ts">
import { RouterLink } from 'vue-router';
import ConnectionStatus from '../../core/ConnectionStatus.component.vue';
  
  const props = defineProps({
    connection: {
        type: Object
    },
    iface: {
        type: Object
    }
  });

</script>

<template>
 <div class="card bg-base-100 bg-opacity-70 shadow-xl border-teal-900 border-2 mb-2">
    <div class="card-body">
      <h2 class="card-title">
        
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 border-teal-500 border-2 rounded-xl p-2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
        
        Serial

      </h2>
      <p>
        Connect DEJA Throttle to a DCCEX Command Station Arduino connected directly to this computer. Requires modern Chromium browser.
      </p>
      <div class="card-actions justify-between items-center">
        <div class="flex">
          <div class="p-2 text-error">            
            <ConnectionStatus :connected="connection?.connected" :connected-label="iface?.id" />
          </div> 
        </div>
        
        <router-link
          :to="`/connect/serial/${iface?.id}`"
          custom
          v-slot="{ navigate }"          
        >
          <button
            @click="navigate"
            role="link"
            class="btn btn-primary btn-outline"
          >
          <span v-if="!connection?.connected">Connect</span>
          <span v-else>Configure</span>
          
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>
