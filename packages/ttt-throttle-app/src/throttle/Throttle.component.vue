<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { debounce } from 'vue-debounce'
  import TurnoutsList from '../turnouts/TurnoutList.component.vue'
  import dccApi from '../connections/dccApi.js';

  const props = defineProps({
    loco: {
        type: Object
    }
  });
  const emit = defineEmits(['update:loco'])

  const rangeValue = ref(0);
  const currentSpeed = ref(0);
  const loco = ref(props.loco);

  const setSpeed = debounce(val => currentSpeed.value = val, '400ms')

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

    console.log('new-old', newSpeed, oldSpeed);
    const address = loco.value?.address;
    if (!address) {
      // TODO: handle error
      return;
    }
    let delay = 0;
    if (newSpeed > 0 && oldSpeed < 0) {
      //change direction to forward
      console.log('change direction to forward');
      loco.value?.address && await dccApi.setSpeed(loco.value.address, 0);
      delay = 1000;
    } else if (newSpeed < 0 && oldSpeed > 0) {
      //change direction to reverse
      console.log('change direction to reverse');
      loco.value?.address && await dccApi.setSpeed(loco.value.address, 0);
      delay = 1000;
    }
    setTimeout(() => {
      console.log('sendLocoSpeed', currentSpeed.value);
      loco.value?.address && dccApi.setSpeed(loco.value.address, currentSpeed.value);
    }, delay);
    
  }

  async function clearLoco() {
    await emit('update:loco');
    loco.value = null;
  }

  watch(currentSpeed, sendLocoSpeed)

</script>

<template>

  <main class="card m-5 bg-slate-600 shadow-xl flex-grow">
    <header class="p-2 text-xl text-gray-900 bg-gradient-to-r from-green-500 to-cyan-500">
      <div class="avatar placeholder">
        <div class="bg-orange-600 text-neutral-content rounded-full w-8">
          <span class="text-sm">{{ loco?.address }}</span>
        </div>
      </div> 
      
      {{ loco?.name }}
      <button class="btn btn-circle btn-outline text-black btn-xs" @click="clearLoco">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </header>
    <section class="throttle flex flex-row flex-row-reverse flex-grow">
      <section class="py-8 px-3 text-center  flex-1">
        <input type="range" min="-100" max="100" step="1" :value="rangeValue" @input="onSlider" class="throttle-slider range-style bg-slate-800 px-3 rounded-md" />
      </section>
      <section class="py-8 px-3 flex flex-col items-center justify-between flex-1">
        <TurnoutsList />
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
    background-color: #15141c;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='105' viewBox='0 0 80 105'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='death-star' fill='%23455b60' fill-opacity='0.4'%3E%3Cpath d='M20 10a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V10zm15 35a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zM20 75a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V75zm30-65a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V10zm0 65a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V75zM35 10a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10zM5 45a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zm0-35a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10zm60 35a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zm0-35a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

</style>