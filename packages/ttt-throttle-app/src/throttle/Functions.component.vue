<script setup lang="ts">
  import Function from './Function.component.vue'

  const props = defineProps<{
    loco: number
  }>();

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

</script>
<template>
  <div class="drawer drawer-end">
    <input id="func-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex justify-center">
      <label for="func-drawer" class="drawer-button btn btn-primary btn-outline">Functions</label>
    </div>
    <div class="drawer-side">
      <label for="func-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4 pb-24">
        <template v-for="func in functions">
          <li>
            <Function :func="func" :loco="props.loco"  />
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>