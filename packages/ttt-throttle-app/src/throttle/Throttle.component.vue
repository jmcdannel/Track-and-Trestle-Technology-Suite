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
  const loco = ref(route.params.locoId)
  const dccApi = useDcc()

  const functions = [
    { id: 0, name: 'F0', icon: 'light' },
    { id: 1, name: 'F1', icon: 'bell' },
    { id: 2, name: 'F2', icon: 'horn' },
    { id: 3, name: 'F3' },
    { id: 4, name: 'F4' },
    { id: 5, name: 'F5' },
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
    { id: 28, name: 'F28' }
  ]

  const setSpeed = debounce((val: number) => currentSpeed.value = val, `${DEBOUNCE_DELAY}ms`)

  function onSlider(e) {
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

  <main class="card m-5 bg-slate-600 shadow-xl flex-grow">
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
    <section class="functions p-2 bg-gradient-to-r flex flex-wrap justify-center from-cyan-900 to-blue-900 overflow-x-auto max-h-32 ">
     
      <template v-for="func in functions">
        <Function :func="func" :loco="loco"  />
        <button class="btn btn-md btn-outline btn-secondary min-w-24 m-1" @click="cabFuction(func.id)">
          <template v-if="func.icon">            
            
            <svg v-if="func.icon === 'light'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            
            <svg v-else-if="func.icon === 'bell'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>

            <svg v-else-if="func.icon === 'horn'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
            </svg>

          </template>
          <template v-else>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
            </svg>
          </template>
          <span>{{ func.name }}</span>
        </button>
      </template>
      
    </section>
    <section class="throttle flex flex-row flex-row-reverse flex-grow">
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
    box-shadow: inset 0 0 12px 12px #rgba(0,0,0,.5);
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

</style>../api/dccApi.js