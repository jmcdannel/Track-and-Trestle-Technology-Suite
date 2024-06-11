<script setup lang="ts">
  import { ref } from 'vue';
  import { RouterLink } from 'vue-router'
  import { useRoute, type RouteRecordName } from 'vue-router'

  const titles: { [key in RouteRecordName]: string } = {
    'effects': 'Effects',
    'throttle': 'Throttle',
    'turnouts': 'Turnouts'
  };
  
  const route = useRoute();
  const routeName = route?.name || 'throttle';

  const pageTitle = ref(titles?.[routeName]);

</script>

<template>
  <router-link to="/" class="btn btn-ghost normal-case text-xl">    
    <span class="bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600 bl font-extrabold">
      <!-- T<small class="text-xxs"></small> 
      & 
      T<small></small> -->
      DEJA
    </span> 
    <span class="text-sm bg-clip-text bg-gradient-to-r from-red-800 to-fuchsia-700 uppercase">
      {{ pageTitle }}  
    </span>
  </router-link>
</template>
