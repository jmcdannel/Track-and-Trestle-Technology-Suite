<script setup>
import { defineProps, defineEmits } from 'vue';
  import closeIconSvg from '@/assets/icons/close.svg'

const props = defineProps({
  loco: {
    type: number,
    required: true
  }
});

const emits = defineEmits(['clearLoco']);

const clearLoco = () => {
  emits('clearLoco');
};
</script>
<template>
  <header class="p-2 text-lg text-gray-900 bg-gradient-to-r from-green-500 to-cyan-500 flex items-center justify-between">
    <div class="avatar placeholder">
      <div class="bg-orange-600 text-neutral-content rounded-full w-8">
        <span class="text-sm">{{ loco }}</span>
      </div>
    </div>
    <button class="btn btn-circle btn-outline text-white btn-xs bg-gray-200 border-gray-200" @click="clearLoco">
      <img :src="closeIconSvg" alt="clear layout" class="h-3 w-3" />
    </button>
  </header>
</template>
