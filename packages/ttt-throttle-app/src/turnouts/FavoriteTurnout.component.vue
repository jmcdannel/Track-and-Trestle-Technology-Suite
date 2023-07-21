<script setup lang="ts">
  import { ref } from 'vue';
  import api from '../api/api.ts'

  const props = defineProps({
    turnout: {
        type: Object
    }
  });
  const emit = defineEmits(['update:turnout'])

  const turnout = ref(props.turnout);

  const toggleTurnout = async (e) => {
    turnout.value = { ...turnout.value, state: !turnout.value.state };
    const { turnoutId, state } = turnout.value;
    await api.turnouts.put({ turnoutId, state: !state });
    await emit('update:turnout', { ...turnout.value, state: !state });
  }

</script>

<template>
  <button @click="toggleTurnout" class="btn btn-outline btn-primary block flex-grow mx-8 font-bold py-2 px-4 rounded">
    {{  turnout.name  }}
  </button>
</template>
