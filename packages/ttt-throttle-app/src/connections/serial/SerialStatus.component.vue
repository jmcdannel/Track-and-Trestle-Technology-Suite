<script setup lang="ts">
import { RouterLink } from 'vue-router'
import ConnectionStatus from '@/core/ConnectionStatus.component.vue'
import linkIconSvg from '@/assets/icons/link.svg'
  
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
        <img :src="linkIconSvg" alt="my-logo"  class="w-16 h-16 fill-white strike-white border-teal-500 border-2 rounded-xl p-2" />
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
