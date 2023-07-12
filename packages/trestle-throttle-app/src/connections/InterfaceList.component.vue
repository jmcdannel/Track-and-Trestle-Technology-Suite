<script setup lang="ts">
  import Serial from '../connections/Serial.component.vue'

  const props = defineProps({
    interfaces: Array
  });

</script>

<template>
  <ul class="p-2">
    <li class="mb-2" v-for="iface in interfaces" :key="iface.id">
      <Serial v-if="iface.type === 'serial'" :iface="iface" />
    </li>
  </ul>
</template>
