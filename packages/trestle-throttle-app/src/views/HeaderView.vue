<script setup lang="ts">
  import { ref } from 'vue';
  import Title from '../core/Title.component.vue';
  import Power from '../core/Power.component.vue';
  import Layout from '../connections/Layout.component.vue';

</script>

<template>
  <header>
    <div class="navbar bg-base-100">
      <div class="navbar-start">
        <Power />
      </div>
      <div class="navbar-center">
       <Title />
      </div>
      <div class="navbar-end">
        <Layout />
      </div>
    </div>
  </header>
</template>
