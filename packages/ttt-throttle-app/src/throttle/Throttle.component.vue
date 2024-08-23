<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { debounce } from 'vue-debounce'
  import Functions from './Functions.component.vue'
  import Consist from './Consist.component.vue'
  import ThrottleButtonControls from './ThrottleButtonControls.component.vue'
  import ThrottleSliderControls from './ThrottleSliderControls.component.vue'
  import CurrentSpeed from './CurrentSpeed.component.vue'
  import ThrottleHeader from './ThrottleHeader.component.vue'
  import useDcc from '../api/dccApi'
  import router from '../router'

  const DEBOUNCE_DELAY = 100 // debounce speed changes by 100ms to prevent too many requests
  const SWITCH_DIR_DELAY = 1000 // delay in ms to switch direction - occurs when slider goes from positive to negative value - which an occur quickly

  const dccApi = useDcc()
  const route = useRoute()

  const currentSpeed = ref(0)
  const loco = ref(parseInt(route.params.locoId as string))

  const setSpeed = debounce((val: number): void => { currentSpeed.value = val; }, `${DEBOUNCE_DELAY}ms`)

  async function handleStop() {
    currentSpeed.value = 0
  }

  function adjustSpeed(val: number): void { // handle incremental speed changes
    currentSpeed.value = currentSpeed.value + val
  }

  function setSliderSpeed(val: number): void { // handle slider changes
    setSpeed(parseInt(val.toString()))
  }

  async function clearLoco() {
    await handleStop()
    router.push({ name: 'home' })
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

  watch(currentSpeed, sendLocoSpeed)
</script>
<template>
  <main class="card m-5 bg-slate-600 shadow-xl flex-grow overflow-auto">
    <ThrottleHeader :loco="loco" @clearLoco="clearLoco" />
    <section class="throttle flex flex-row flex-grow overflow-auto">
      <section class="py-8 px-3 text-center  flex-1">
        <ThrottleSliderControls :speed="currentSpeed" @update:currentSpeed="setSliderSpeed" @stop="handleStop" />  
      </section>
      <section class="py-8 px-3 flex flex-col items-center justify-between flex-1">
        <Consist />
        <Functions :loco="loco" />
        <CurrentSpeed :speed="currentSpeed" />
        <ThrottleButtonControls :speed="currentSpeed" @update:currentSpeed="adjustSpeed" @stop="handleStop" />
      </section>
    </section>
  </main>  
</template>
<style scroped>  
  .throttle {
    background-color: #0d0c14;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='105' viewBox='0 0 80 105'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='death-star' fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M20 10a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V10zm15 35a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zM20 75a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V75zm30-65a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V10zm0 65a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V75zM35 10a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10zM5 45a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zm0-35a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10zm60 35a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zm0-35a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
</style>