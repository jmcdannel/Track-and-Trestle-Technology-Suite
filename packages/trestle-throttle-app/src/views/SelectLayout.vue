<script setup lang="ts">

const props = defineProps({
    layouts: {
        type: Array<Object>
    }
  })
  const emit = defineEmits(['update:layoutId'])

  const handleSelectLayout = async (e:any) => {
    console.log('handleSelectLayout', e.target.value);
    await emit('update:layoutId', e.target.value);
  }
</script>

<template>
  <main class="py-3 px-2">
    <h2 class="fancy-title placeholder:font-extrabold text-transparent te text-5xl bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600">
      Select
      Your
      <strong class="text-7xl uppercase">Layout</strong>
    </h2>
    <ul class="p-2 flex flex-col items-center" v-if="layouts?.length > 0">
      <li class="mb-2" v-for="layout in layouts" :key="layout._id">
        <button class="btn bg-gradient-to-br from-lime-500 to-blue-500 text-gray-800 text-lg btn-wide btn-lg" @click="handleSelectLayout" :value="layout.layoutId">{{layout.name}}</button>
      </li>
    </ul>
    
  </main>
</template>

<style scoped>
  .fancy-title {
    word-spacing: 90vw; 
  }

  @media screen and (max-width: 640px) {
    .fancy-title {
      word-spacing: normal;
    }
  }
</style>
