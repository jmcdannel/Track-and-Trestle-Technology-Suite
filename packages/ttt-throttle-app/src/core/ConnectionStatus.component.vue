<script setup lang="ts">
  import { ref } from 'vue';

  
  const props = defineProps({
    connected: {
        type: Boolean,
        default: undefined
    },
    connectedLabel: {
        type: String,
        default: 'Connected'
    },
    disconnectedLabel: {
        type: String,
        default: 'Disconnected'
    }
  });

  const isStatusUndefined = ref(props.connected === undefined);

  const emit = defineEmits(['clear'])

  const clearclick = async () => {
    await emit('clear');
  }

</script>
<template>
  <template v-if="connected">
   <button class="mb-1 btn btn-ghost" @click="clearclick">
     <span class="inline-flex items-center bg-green-100 text-green-800 text-3xl font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3 mr-1 fill-green-500">
       <path fill-rule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clip-rule="evenodd" />
     </svg>
     <span class="text-sm"> {{  connectedLabel  }}</span>
     </span>
   </button>      
 </template>
  <template v-else-if="isStatusUndefined">
    <span class="mb-1 inline-flex items-center bg-red-100 text-gray-800 text-3xl font-medium mr-2 px-8 py-1 rounded-full dark:bg-gray-900 dark:text-gray-300">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3 mr-1 fill-gray-500">
        <path fill-rule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clip-rule="evenodd" />
      </svg>
      <span class="text-sm">{{ disconnectedLabel }}</span>
    </span>    
</template>
<template v-else>
    <span class="mb-1 inline-flex items-center bg-red-100 text-red-800 text-3xl font-medium mr-2 px-8 py-1 rounded-full dark:bg-red-900 dark:text-red-300">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3 mr-1 fill-red-600">
        <path fill-rule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clip-rule="evenodd" />
      </svg>
      <span class="text-sm">{{ disconnectedLabel }}</span>
    </span>
</template>
</template>