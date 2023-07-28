<script setup lang="ts">
  import { ref, watch } from 'vue';
  import TurnoutSvg from './Turnout.svg.vue';
  import api from '../api/api.ts'
  import actionState from '../store/actions.tsx'


  const props = defineProps({
    turnout: {
        type: Object
    }
  });
  const emit = defineEmits(['update:turnout'])

  const turnout = ref(props.turnout);
  const layoutState = ref(props.turnout.state);

  console.log('[TURNOUT]', props.turnout, actionState);

  const toggleTurnout = async (e) => {
    console.log('TURNOUT.toggleTurnout', turnout.value);
    const { turnoutId, state } = turnout.value;
    await api.turnouts.put({ turnoutId, state: !state });
    // await emit('update:turnout', { ...turnout.value, state: !state });
    turnout.value = { ...turnout.value, state: !state };
  }

  async function addFav() {
    api.favorites.add({ type: 'turnout', ...turnout.value });
  }

  function actionStateChanged(newVal) {
    console.log('actionStateChanged', newVal.turnouts?.[turnout.value.turnoutId]?.state);
    setTimeout(() => {
      layoutState.value = newVal.turnouts?.[turnout.value.turnoutId]?.state;
    }, 50);
  }

  watch(actionState.actions, actionStateChanged);

</script>

<template>
  <main class="px-4 py-2 flex justify-between bg-slate-900 my-1 rounded-full ">
    <div>
      <button class="btn btn-ghost btn-circle text-amber-500" @click="addFav">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      </button>
    </div>
    <button @click="toggleTurnout" class="btn btn-outline btn-primary block flex-grow mx-2 font-bold py-2 px-4 rounded flex items-center">
      <div>{{  turnout.name  }}</div>
      <div class="w-12">
        <TurnoutSvg :class="layoutState ? 'straight' : 'divergent'" />
      </div>
    </button>
    <div class="pt-2">

      <span class="inline-flex min-w-[7rem] ml-2 flex-grow justify-between items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
        <span v-if="layoutState" class="w-2 h-2 mx-2 bg-green-500 rounded-full"></span>
        <span v-else class="w-2 h-2 mr-1 bg-red-500 rounded-full"></span>
        <span class="text-xs">{{ turnout.state ? 'straight' : 'divergent' }}</span>
        <span class="w-3 h-3 rounded-full ml-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </span>
      </span>
    </div>
    <!-- create a tailwindcss card with actions, and icon and title -->
  </main>
</template>


