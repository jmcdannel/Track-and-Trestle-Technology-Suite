<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { debounce } from 'vue-debounce'
  import axios from "axios";
  import { LAYOUT_ID } from '../constants.js';

  const locos = ref(null);

  onMounted(async () => {
    console.log('MiniThrottle.onMounted');
    getLocos(LAYOUT_ID);
  });

  async function getLocos(layoutId:string) {
    try {
      const { data } = await axios.get(`/api/${layoutId}/locos`);

      console.log('data', data);
      locos.value = data;
    } catch (err) {
      console.error(err);
    }
  }

  const rangeValue = ref(0);
  const currentSpeed = ref(0);

  const setSpeed = debounce(val => currentSpeed.value = val, '400ms')

  const DEFAULT_LOCO =   {
    "address": 31,
    "autoStop": true,
    "cruiseControl": false,
    "forward": true,
    "idleByDefault": true,
    "isAcquired": false,
    "maxSpeed": 30,
    "name": "BNSF-5931",
    "road": "BNSF",
    "speed": 0
  }

  const props = defineProps({
    address: Number
  });

  function onSlider(e) {
    rangeValue.value = parseInt(e.target.value);
    setSpeed(parseInt(e.target.value));
  }

  const loco = ref(DEFAULT_LOCO);

  async function sendLocoSpeed() {
    console.log('sendLocoSpeed', currentSpeed.value);
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
      <div class="current-speed direction-fwd">
        {{ rangeValue }}
      </div>
      <div class="px-2 py-4">
        <button class="btn btn-accent btn-sm">+</button>
        <button class="btn btn-primary btn-sm">stop</button>
        <button class="btn btn-accent btn-sm">-</button>
      </div>
    </section>
    <footer class="p-1 text-gray-900 bg-accent">
      [connected]
    </footer>
    <pre>{{  locos  }}</pre>
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
</style>