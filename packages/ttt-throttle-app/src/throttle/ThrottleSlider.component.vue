<script setup lang="ts">
  import { defineEmits, defineProps, onMounted, ref, watch, toRef } from 'vue'

  const emit = defineEmits(['update:currentSpeed', 'stop'])

  const props  = defineProps({
    speed: {
      type: Number,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showSteps: {
      type: Boolean,
      default: false
    }
  })

  const slider = ref(null)
  const dragger = ref(null)
  const sliderPosition = ref(0)
  const speed = toRef(props, 'speed')

  let down = false
  let sliderHeight = 0
  let sliderTop = 0


  onMounted(() => {
    sliderHeight = slider.value.clientHeight
    sliderTop = slider.value.getBoundingClientRect().top
    updateSlider(speed.value)
  })


  function sliderUp() {
    if (props.disabled) {
      return
    }
    down = false
  }

  function sliderDown(event) {
    if (props.disabled) {
      return
    }
    down = true
    updateDragger(event.offsetY)
    return false
  }

  function sliderMove(event) {
    if (props.disabled) {
      return
    }
    if (down) {
      console.log('sliderMove', event.clientY - sliderTop, event.clientY, sliderTop)
      if (event.clientY - sliderTop > 1 && event.clientY - sliderTop < sliderHeight - 1) {
        updateDragger(event.clientY - sliderTop)
      }
    }
  }

  function updateSlider(y: number) {
    console.log('updateSlider', y, sliderHeight, (Math.abs(y) * sliderHeight / 100))
    sliderPosition.value = sliderHeight - (Math.abs(y) * sliderHeight / 100) - 8
  }

  function updateDragger(y: number) {
    const newSpeed = 100 - (y / sliderHeight * 100)
    console.log('updateDragger', y, parseInt(newSpeed.toString()))
    emit('update:currentSpeed', parseInt(newSpeed.toString()))
    
    sliderPosition.value = y - 8
    // dragger.value.styles.top = y + 'px'
  }

  watch(speed, (val) => {
    console.log('watch', val)
    updateSlider(val)
    // sliderPosition.value = (100 - val) / 100 * sliderHeight
  })

</script>
<template>
  <div :class="props.disabled ? 'range-slider range-slider--disabled' : 'range-slider range-slider--enabled'" ref="slider" @mousedown="sliderDown" @mouseup="sliderUp" @mousemove="sliderMove">
    <span :style="{ top: sliderPosition + 'px' }" ref="dragger"></span>
  </div>
</template>
<style scoped>
  .range-slider {
    width: 5rem;
    height: 100%;
    margin: 0 auto;
    position: relative;
    /* padding: 1.5rem 0; */
  }
  .range-slider:before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #31ebf5;
    /* border-radius : 5rem; */
    /* padding: 1.5rem 0; */
  }
  .range-slider span {
    display: block;
    height: 1rem;
    /* margin-top: -8px; */
    width: 7rem;
    left: -1rem;
    position:relative;
    z-index:2;
    background-color:#f531bd;
    cursor: pointer;
    border-radius: .5rem;
    opacity: .8;
  }
  .range-slider--disabled span {
    background-color: #ccc;
    cursor: not-allowed;
  }
  .range-slider--disabled::before {
    opacity: .5;
  }
</style>