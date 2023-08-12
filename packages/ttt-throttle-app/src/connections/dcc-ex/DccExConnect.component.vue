<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { RouterLink } from 'vue-router';
  import router from '../../router/index.ts';
  import api from '../../api/api.ts';
  import { store } from '../../store/store.tsx';

  const connectionId = ref( api.dcc.getConnectionId());
  const connection = ref(store?.connections?.[connectionId.value]);
  console.log('connectionId', connectionId.value, connection.value);

  onMounted(() => {
    api.dcc.send('listPorts', { connectionId });
  });

  const handlePortClick = async (e) => {
    try {
      e.preventDefault();
      console.log('handlePortClick', e.target.value);
      // TODO: save serial port config
      await api.config.set(connectionId.value, e.target.value);
      await api.dcc.send('connect', { serial: e.target.value });
      // host.value = await api.setHost(e.target.value);
      // const layouts = await api.connect();
      // connStatus.value = layouts.length > 0;   
      // console.log('handleHostClick', host.value, connStatus.value);
      // if (connections.value?.layoutApi) {
      //   store.connections = {...connections.value, ... {
      //     layoutApi: {
      //       connected: true,
      //       url: host.value
      //     }
      //   }}
      // }

      router.push({ name: 'home' });
    } catch (err) {
      console.error(err);
    }
  }

</script>

<template>
  <main class="p-4 flex flex-col justify-between w-full">
    <header>
      <h1 class="fancy-title leading-tight text-transparent text-8xl bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600">Connect</h1>
      <h2 class="text-5xl flex items-end ">
        <span class="text-3xl mr-4 bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-600 bl">
          T<small class="text-xxs"></small> 
          & 
          T<small></small>
        </span> 
        <span class="bg-clip-text bg-gradient-to-r from-red-800 to-fuchsia-700 uppercase font-extrabold">
          DCC EX
        </span>
      </h2>
    </header>
    <main class="my-1 pt-8 flex-grow">  
      <ul>
        <li v-for="port in connection.ports" :key="port">
          <button class="btn btn-sm btn-outline w-full border-teal-500" :value="port" @click="handlePortClick">{{ port }}</button>
          <div className="divider"></div> 
        </li>
      </ul>
    </main>
  </main>
</template>

<style>

</style>
