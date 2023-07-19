<script setup>
    import { ref } from 'vue';
  import api from '../connections/api.js'

  // q: in VueJS, how do I get the v-model in a child component?
  // a: https://stackoverflow.com/questions/66332325/in-vuejs-how-do-i-get-the-v-model-in-a-child-component

  const props = defineProps({
    efx: {
        type: Object
    },
    efxModifiers: { default: () => ({}) }
  })
  const emit = defineEmits(['update:efx'])

  const efx = ref(props?.efx)

  const handleEffect = async () => {
    efx.value.state = !efx.value.state;
    const { effectId, state } = efx.value;
    await api.effects.put({ effectId, state: !state });
    await emit('update:efx', { ...efx.value, state: !state });
  }

</script>

<template>
  <button class="btn btn-success btn-outline" @click="handleEffect">{{ efx.name }}</button>
</template>