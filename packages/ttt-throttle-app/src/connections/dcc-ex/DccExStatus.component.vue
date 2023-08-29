<script setup lang="ts">
  import { RouterLink } from 'vue-router';
  import ConnectionStatus from '../../core/ConnectionStatus.component.vue';

  const DCCJS_LABEL = 'DCC-JS API';
  const DCCEX_LABEL = 'EX Command Station';
  
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
        
        DCC-EX 

      </h2>
      <div class="card-actions justify-between items-center">
        <div class="flex">
          <div class="p-2 text-error">
            
            <ConnectionStatus :connected="connection?.api" :connected-label="DCCJS_LABEL" :disconnected-label="DCCJS_LABEL" />
            <ConnectionStatus :connected="connection?.connected" :connected-label="DCCEX_LABEL" :disconnected-label="DCCEX_LABEL" />

          </div> 
        </div>
          <!-- <pre>dccApi: {{ dccApi }}</pre>
          <pre>dccApi?.connected: {{ dccApi?.connected }}</pre> -->
        
        <router-link
          :to="`/connect/dcc-ex/${iface?.id}`"
          custom
          v-slot="{ navigate }"
          
        >
          <button
            @click="navigate"
            role="link"
            class="btn btn-primary btn-outline"
          >
          <span v-if="!dccApi?.connected">Connect</span>
          <span v-else>Configure</span>
          
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>
