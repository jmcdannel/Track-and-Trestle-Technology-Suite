<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute } from 'vue-router'

  const titles = {
    'effects': 'Effects',
    'throttle': 'Throttle',
    'turnouts': 'Turnouts'
  };
  
  const route = useRoute();
  const routeName = route?.name || 'throttle';

  const pageTitle = ref(titles?.[routeName]);

</script>

<template>
  <a class="btn btn-ghost normal-case text-xl">
    <span class="text-sm bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600 bl">
      T<small class="text-xxs"></small> 
      & 
      T<small></small>
    </span> 
    <span class="bg-clip-text bg-gradient-to-r from-red-800 to-fuchsia-700 uppercase font-extrabold">
      {{ pageTitle }}  
    </span>
  </a>
</template>
