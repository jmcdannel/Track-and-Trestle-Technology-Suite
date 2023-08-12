<script setup lang="ts">
  import { RouterLink } from 'vue-router';
  import ConnectionStatus from '../../core/ConnectionStatus.component.vue';

const props = defineProps({
    connection: {
        type: Object
    },
    statusLabel: {
        type: String
    }
  });

  // console.log('LayoutApiStatus', connection);

</script>
<template>
  <div class="card bg-base-100 bg-opacity-70 shadow-xl border-teal-900 border-2 mb-2">
    <div class="card-body">
      <h2 class="card-title">
        
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 border-teal-500 border-2 rounded-xl p-2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
        </svg>
        
        DCC.JS Layout API

      </h2>
      <div class="card-actions justify-between items-center">
        <div class="p-2 text-error">
          <ConnectionStatus :connected="connection?.connected" :connected-label="statusLabel" />

        </div> 
        <router-link
          to="/connect/layoutapi"
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
        
        <router-link
          to="/connect/layoutId"
          custom
          v-slot="{ navigate }"
          v-if="connection?.connected && !statusLabel"
        >
          <button
            @click="navigate"
            role="link"
            class="btn btn-primary btn-outline"
          >
          Select Layout
          </button>
        </router-link>
        
      </div>
    </div>
  </div>
</template>