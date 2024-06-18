<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { debounce } from 'vue-debounce'
  import Function from './Function.component.vue'
  import useDcc from '../api/dccApi'
  import router from '../router'

  const DEBOUNCE_DELAY = 100
  const SWITCH_DIR_DELAY = 1000

  const route = useRoute()
  const rangeValue = ref(0)
  const currentSpeed = ref(0)
  const loco = ref(parseInt(route.params.locoId as string))
  const dccApi = useDcc()

  const functions = [
    { id: 0, name: 'F0', icon: 'light' },
    { id: 1, name: 'F1', icon: 'bell' },
    { id: 2, name: 'F2', icon: 'horn' },
    { id: 3, name: 'F3' },
    { id: 4, name: 'F4' },
    { id: 5, name: 'F5' },
    { id: 6, name: 'F6' },
    { id: 7, name: 'F7' },
    { id: 8, name: 'F8' },
    { id: 9, name: 'F9' },
    { id: 10, name: 'F10' },
    { id: 11, name: 'F11' },
    { id: 12, name: 'F12' },
    { id: 13, name: 'F13' },
    { id: 14, name: 'F14' },
    { id: 15, name: 'F15' },
    { id: 16, name: 'F16' },
    { id: 17, name: 'F17' },
    { id: 18, name: 'F18' },
    { id: 19, name: 'F19' },
    { id: 20, name: 'F20' },
    { id: 21, name: 'F21' },
    { id: 22, name: 'F22' },
    { id: 23, name: 'F23' },
    { id: 24, name: 'F24' },
    { id: 25, name: 'F25' },
    { id: 26, name: 'F26' },
    { id: 27, name: 'F27' },
    { id: 28, name: 'F28' },
    { id: 29, name: 'F29' },
    { id: 30, name: 'F30' },
    { id: 31, name: 'F31' }
  ]

  const setSpeed = debounce((val: number): void => { currentSpeed.value = val; }, `${DEBOUNCE_DELAY}ms`)

  function onSlider(e:any) {
    const newSpeed = parseInt(e.target.value);
    rangeValue.value = newSpeed;
    setSpeed(newSpeed);
  }

  async function handleStop() {
    currentSpeed.value = 0;
    rangeValue.value = currentSpeed.value;
  }

  async function handleUp() {
    currentSpeed.value = currentSpeed.value + 1;
    rangeValue.value = currentSpeed.value;
  }

  async function handleDown() {
    currentSpeed.value = currentSpeed.value - 1;
    rangeValue.value = currentSpeed.value;
  }

  async function sendLocoSpeed(newSpeed:number, oldSpeed:number) {

    const address = loco.value;
    if (!address) {
      // TODO: handle error
      return;
    }
    let delay = 0;
    if (newSpeed > 0 && oldSpeed < 0) {
      //change direction to forward
      console.log('change direction to forward');
      await dccApi.setSpeed(loco.value, 0); // stop
      delay = SWITCH_DIR_DELAY;
    } else if (newSpeed < 0 && oldSpeed > 0) {
      //change direction to reverse
      console.log('change direction to reverse');
      await dccApi.setSpeed(loco.value, 0); // stop
      delay = SWITCH_DIR_DELAY;
    }
    setTimeout(() => {
      dccApi.setSpeed(loco.value, currentSpeed.value);
    }, delay);
    
  }

  async function clearLoco() {
    await handleStop();
    router.push({ 'name': 'throttle'})
  }

  watch(currentSpeed, sendLocoSpeed)

</script>

<template>

  <!-- TODO: break into small components -->

  <main class="card m-5 bg-slate-600 shadow-xl flex-grow h-full">
    <header class="p-2 text-lg text-gray-900 bg-gradient-to-r from-green-500 to-cyan-500 flex  items-center justify-between">
      <div class="avatar placeholder">
        <div class="bg-orange-600 text-neutral-content rounded-full w-8">
          <span class="text-sm">{{ loco }}</span>
        </div>
      </div> 
      <button class="btn btn-circle btn-outline text-black btn-xs" @click="clearLoco">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </header>
    <section class="throttle flex flex-row flex-grow overflow-auto">
      <section class="py-8 px-3 text-center  flex-1">
        <input type="range" min="-100" max="100" step="1" :value="rangeValue" @input="onSlider" class="throttle-slider range-style bg-slate-800 px-3 rounded-md" />
      </section>

      <section class="py-8 px-3 flex flex-col items-center justify-between flex-1">
       <div class=" direction-fwd flex justify-center">
          <span class="current-speed [min-width:8rem] shadow-lg shadow-blue-500/50 text-center text-5xl p-4 rounded-xl shadow-inner bg-gradient-to-r from-purple-500 to-pink-600">{{ rangeValue }}</span>
        </div>
        <div class="px-2 py-4 flex flex-col">
          <div>
            <button class="speed-btn btn btn-accent btn-xl" @click="handleUp">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          <div>
            <button class="speed-btn btn btn-primary btn-xl" @click="handleStop">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          <div>
            <button class="speed-btn btn btn-accent btn-xl" @click="handleDown">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </section>
        <section class="functions p-2 bg-gradient-to-r flex flex-col from-cyan-900 to-blue-900 max-h-fit overflow-y-auto">
        
        <template v-for="func in functions">
          <Function :func="func" :loco="loco"  />
        </template>
        
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
  
  .speed-btn {
    height: auto;
  }
  .throttle {
    background-color: #0d0c14;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='105' viewBox='0 0 80 105'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='death-star' fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M20 10a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V10zm15 35a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zM20 75a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V75zm30-65a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V10zm0 65a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V75zM35 10a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10zM5 45a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zm0-35a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10zm60 35a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zm0-35a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

</style>