<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { debounce } from 'vue-debounce'
  import dccApi from '../api/dccApi.js';

  const props = defineProps({
    loco: {
        type: Object
    }
  });
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
    let delay = 0;
    if (newSpeed > 0 && oldSpeed < 0) {
      //change direction to forward
      console.log('change direction to forward');
      await dccApi.setSpeed(loco.value.address, 0);
      delay = 1000;
    } else if (newSpeed < 0 && oldSpeed > 0) {
      //change direction to reverse
      console.log('change direction to reverse');
      await dccApi.setSpeed(loco.value.address, 0);
      delay = 1000;
    }
    setTimeout(() => {
      console.log('sendLocoSpeed', currentSpeed.value);
      dccApi.setSpeed(loco.value.address, currentSpeed.value);
    }, delay);
    
  }

  watch(currentSpeed, sendLocoSpeed)

</script>

<template>

  <main class="card m-2 bg-slate-600 shadow-xl">
    <header class="p-2 text-xl text-gray-900 bg-gradient-to-r from-green-500 to-cyan-500">
      <div class="avatar placeholder">
        <div class="bg-orange-600 text-neutral-content rounded-full w-8">
          <span class="text-sm">{{ loco?.address }}</span>
        </div>
      </div> 
      
      {{ loco?.name }}
    </header>
    <section class="py-8 px-3">
      <input type="range" min="-100" max="100" step="1" :value="rangeValue" @input="onSlider" class="range-style bg-slate-800 px-3 rounded-md" />
    </section>
    <section>
      <div class="current-speed direction-fwd flex justify-center">
        <span class="[min-width:8rem] text-center text-5xl p-4 rounded-xl shadow-inner bg-gradient-to-r from-purple-500 to-pink-600">{{ rangeValue }}</span>
      </div>
      <div class="px-2 py-4 flex flex-row">
        <button class="btn btn-accent btn-sm px-8" @click="handleDown">-</button>
        <button class="btn btn-primary btn-sm flex-grow" @click="handleStop">stop</button>
        <button class="btn btn-accent btn-sm px-8" @click="handleUp">+</button>
      </div>
    </section>
  </main>
  
</template>

<style scroped>
  input[type=range] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
  input[type=range]:focus {
    outline: none;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
  }
  input[type=range]::-moz-range-thumb {
    border: none;
  }

  .range-style {
    width: 100%;
    height: 40px;
  }
  .range-style::-webkit-slider-runnable-track {
    display: flex;
    align-items: center;
    height: 20px;
    border-radius: 10px;
  }
  .range-style::-webkit-slider-thumb {
    position: relative;
    top: -50%;
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
    top: -50%;
    width: 40px;
    height: 40px;
    background-color: rgb(53, 103, 184);
    border-radius: 50%;
  }
</style>../api/dccApi.js