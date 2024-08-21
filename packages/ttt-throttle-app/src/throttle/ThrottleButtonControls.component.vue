<script setup lang="ts">

  import { defineEmits } from 'vue'
  import plusIconSvg from '@/assets/icons/plus.svg'
  import minusIconSvg from '@/assets/icons/minus.svg'
  import stopIconSvg from '@/assets/icons/stop.svg'

  const emit = defineEmits(['update:currentSpeed', 'stop'])

  async function handleUp() {
    emit('update:currentSpeed', 1)
  }

  async function handleUp5() {
    emit('update:currentSpeed', 5)
  }

  async function handleDown() {
    emit('update:currentSpeed', -1)
  }

  async function handleDown5() {
    emit('update:currentSpeed', -5)
  }

  async function handleStop() {
    emit('stop')
  }

</script>
<template>
  <div class="px-2 py-4 flex flex-col">
    <div class="relative">
      <button class="speed-btn btn btn-accent btn-xl relative rounded-b-none rounded-t-3xl" @click="handleUp5">
        <img :src="plusIconSvg" class="speed-icon h-16 w-16 relative" />
        <span class="speed-val absolute right-4 border-black border-2 text-xs font-bold rounded-full p-1 bg-black text-white w-6 h-6 flex justify-center align-middle">5</span>
      </button>
    </div>
    <hr class="border-black" />
    <div class="relative">
      <button class="speed-btn btn btn-accent btn-xl relative rounded-none" @click="handleUp">
        <img :src="plusIconSvg" class="speed-icon h-16 w-16 relative" />
        <span class="speed-val absolute right-4 border-black border-2 text-xs font-bold rounded-full p-1 bg-black text-white w-6 h-6 flex justify-center align-middle">1</span>
      </button>
    </div>
    <div class="relative">
      <button class="stop-btn btn btn-primary btn-xl rounded-3xl" @click="handleStop">
        <img :src="stopIconSvg" class="h-16 w-16" />
      </button>
    </div>
    <div class="relative">
      <button class="speed-btn btn btn-accent btn-xl relative rounded-none" @click="handleDown">
        <img :src="minusIconSvg" class="speed-icon h-16 w-16 relative" />
        <span class="speed-val absolute right-4 border-black border-2 text-xs font-bold rounded-full p-1 bg-black text-white w-6 h-6 flex justify-center align-middle">1</span>
      </button>
    </div>
    <hr class="border-black" />
    <div class="relative">
      <button class="speed-btn btn btn-accent btn-xl relative rounded-t-none rounded-b-3xl" @click="handleDown5">
        <img :src="minusIconSvg" class="speed-icon h-16 w-16 relative" />
        <span class="speed-val absolute right-4 border-black border-2 text-xs font-bold rounded-full p-1 bg-black text-white w-6 h-6 flex justify-center align-middle">5</span>
      </button>
    </div>
  </div>
</template>
<style scroped>
  
  .speed-btn {
    height: auto;
  }
  .stop-btn {
    height: auto;
    width: 140%;
    position: relative;
    left: -20%;
    z-index: 1;
  }

  .speed-val {
    line-height: .75rem;
  }

  .speed-icon {
    /* left: 4rem; */
    left: -0.5rem;
  }

</style>