<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { debounce } from 'vue-debounce'
  import Functions from './Functions.component.vue'
  import Consist from './Consist.component.vue'
  import ThrottleButtonControls from './ThrottleButtonControls.component.vue'
  import useDcc from '../api/dccApi'
  import router from '../router'
  import closeIconSvg from '@/assets/icons/close.svg'

  const DEBOUNCE_DELAY = 100
  const SWITCH_DIR_DELAY = 1000

  const route = useRoute()
  const rangeValue = ref(0)
  const currentSpeed = ref(0)
  const loco = ref(parseInt(route.params.locoId as string))
  const dccApi = useDcc()


  const setSpeed = debounce((val: number): void => { currentSpeed.value = val; }, `${DEBOUNCE_DELAY}ms`)

  function onSlider(e:any) {
    const newSpeed = parseInt(e.target.value)
    rangeValue.value = newSpeed
    setSpeed(newSpeed)
  }

  async function handleStop() {
    currentSpeed.value = 0
    rangeValue.value = currentSpeed.value
  }

  function adjustSpeed(val: number): void {
    currentSpeed.value = currentSpeed.value + val
    rangeValue.value = currentSpeed.value
  }

  async function sendLocoSpeed(newSpeed:number, oldSpeed:number) {

    const address = loco.value
    if (!address) {
      // TODO: handle error
      return
    }
    let delay = 0
    if (newSpeed > 0 && oldSpeed < 0) {
      //change direction to forward
      console.log('change direction to forward')
      await dccApi.setSpeed(loco.value, 0) // stop
      delay = SWITCH_DIR_DELAY
    } else if (newSpeed < 0 && oldSpeed > 0) {
      //change direction to reverse
      console.log('change direction to reverse')
      await dccApi.setSpeed(loco.value, 0) // stop
      delay = SWITCH_DIR_DELAY
    }
    setTimeout(() => {
      dccApi.setSpeed(loco.value, currentSpeed.value)
    }, delay)
    
  }

  async function clearLoco() {
    console.log('clearLoco')
    await handleStop()
    router.push({ name: 'home' })
  }

  watch(currentSpeed, sendLocoSpeed)

</script>

<template>

  <!-- TODO: break into small components -->

  <main class="card m-5 bg-slate-600 shadow-xl flex-grow overflow-auto">
    <header class="p-2 text-lg text-gray-900 bg-gradient-to-r from-green-500 to-cyan-500 flex  items-center justify-between">
      <div class="avatar placeholder">
        <div class="bg-orange-600 text-neutral-content rounded-full w-8">
          <span class="text-sm">{{ loco }}</span>
        </div>
      </div>
      <button class="btn btn-circle btn-outline text-white btn-xs bg-gray-200 border-gray-200" @click="clearLoco">
        <img :src="closeIconSvg" alt="clear layout"  class="h-3 w-3" />
      </button>
    </header>
    <section class="throttle flex flex-row flex-grow overflow-auto">

      <section class="py-8 px-3 text-center  flex-1">
        <input type="range" min="-100" max="100" step="1" :value="rangeValue" @input="onSlider" class="throttle-slider range-style bg-slate-800 px-3 rounded-md" />
      </section>

      <section class="py-8 px-3 flex flex-col items-center justify-between flex-1">

        <Consist />
        <Functions :loco="loco" />
        <div class="flex justify-center mt-4">
          <span class="current-speed [min-width:8rem] shadow-lg shadow-blue-500/50 text-center text-5xl p-4 rounded-xl shadow-inner bg-gradient-to-r from-purple-500 to-pink-600">{{ rangeValue }}</span>
        </div>
        <ThrottleButtonControls @update:currentSpeed="adjustSpeed" @stop="handleStop" />       
      </section>
    </section>
  </main>
  
</template>

<style scroped>

  input[type=range]:focus {
    outline: none;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
  }
  input[type=range]::-moz-range-thumb {
    border: none;
  }

  .range-style::-webkit-slider-runnable-track {
    display: flex;
    align-items: center;
    height: 20px;
    border-radius: 10px;
  }
  .range-style::-webkit-slider-thumb {
    position: relative;
    /* top: -50%; */
    width: 40px;
    height: 40px;
    background-color: rgb(53, 103, 184);
    border-radius: 50%;
  }
  .range-style::-moz-range-track {
    display: flex;
    align-items: center;
    height: 20px;
    border-radius: 10px;
  }
  .range-style::-moz-range-thumb {
    position: relative;
    /* top: -50%; */
    width: 40px;
    height: 40px;
    background-color: rgb(53, 103, 184);
    border-radius: 50%;
  } 

  .current-speed {
    box-shadow: inset 0 0 12px 12px rgba(0,0,0,.5);
  }  

  .throttle-slider {
    writing-mode: bt-lr; /* IE */
    -webkit-appearance: slider-vertical; /* Chromium */
    width: 50px;
    min-height: 100px;
    height: 100%;
    padding: 0 5px;
  }
  
  .throttle {
    background-color: #0d0c14;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='105' viewBox='0 0 80 105'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='death-star' fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M20 10a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V10zm15 35a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zM20 75a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V75zm30-65a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V10zm0 65a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V75zM35 10a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10zM5 45a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zm0-35a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10zm60 35a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zm0-35a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

</style>