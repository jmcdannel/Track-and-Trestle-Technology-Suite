<script setup lang="ts">
  import { defineEmits, ref, toRef, watch } from 'vue'
  import ThrottleSlider from './ThrottleSlider.component.vue'
  import forwardIconSvg from '@/assets/icons/forward.svg'
  import backwardIconSvg from '@/assets/icons/backward.svg'

  const direction = ref(null as(null | boolean))

  const emit = defineEmits(['update:currentSpeed', 'stop'])

  const props  = defineProps({
    speed: {
      type: Number,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  })

  const speed = toRef(props, 'speed')

  function handleForward() {
    console.log('forward')
    emit('stop')
    direction.value = true
  }

  function handleReverse() {
    console.log('reverse')
    emit('stop')
    direction.value = false
  }

  function handleSliderUpdate(val: number) {
    if (direction.value === null) {
      return
    } else if (direction.value === true) {
      emit('update:currentSpeed', val)
    } else if (direction.value === false) {
      emit('update:currentSpeed', -val)
    }
  }

  function isDisabled() {
    return direction.value === null
  }

  function getButtonColors(isForward: boolean) {
    if (direction.value === null) {
      return 'border-gray-500 text-gray-500'
    }
    if (direction.value === isForward) {
      return 'border-violet-400 text-violet-400'
    } else if (direction.value !== isForward) {
      return 'border-gray-500 text-gray-500'
    } else {
      return 'border-gray-500 text-gray-500'
    }    
  }

  watch(speed, (val: number) => {
    if (val === 0) {
      direction.value = null
    } else if (val > 0) {
      direction.value = true
    } else if (val < 0) {
      direction.value = false
    }
  })

</script>
<template>
  <div class="flex flex-col h-full">
    <div class="flex-grow">
      <ThrottleSlider :speed="speed" @update:currentSpeed="handleSliderUpdate" @stop="$emit('stop')" :disabled="isDisabled()" />
    </div>
    <div class="flex mt-4 align-middle justify-center">
      <button @click="handleReverse" :class="'btn btn-outline mx-1 rounded-l-full min-w-28 text-xs' + getButtonColors(false) ">Reverse</button>
      <button @click="handleForward" :class="'btn btn-outline mx-1 rounded-r-full min-w-28 text-xs' + getButtonColors(true) ">Forward</button>
    </div>
  </div>
</template>
<style scoped>
  
</style>