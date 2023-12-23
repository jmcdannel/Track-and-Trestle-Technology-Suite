<script setup lang="ts">
  import { ref } from 'vue';
  import { RouterLink } from 'vue-router';
  import router from '../../router/index.ts';
  import api from '../../api/api.ts';


  const defaultProtocol = 'http://';
  const defaultPort = '5001';
  const defaultHosts = [
    'tamarackjunctionmbp.local',
    'tttpi.local',
    'localhost',
    '127.0.0.1'
  ];

  const availableHosts = ref(defaultHosts);
  const connStatus = ref(false);
  const host = ref(null);

  const clearHost = async (e) => {
  }

  const handleHostClick = async (e) => {
    try {
      e.preventDefault();
      host.value = await api.config.setHost(e.target.value);
      const layouts = await api.connect();
      connStatus.value = (layouts?.length > 0);
      

      router.push({ name: 'layoutId' });
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
          Layout API
        </span>
      </h2>
    </header>
    <main class="my-1 pt-8 flex-grow">

      <div class="flex items-center justify-center">
        <template v-if="connStatus">
          <button class="btn btn-ghost" @click="clearHost">
            <span class="inline-flex items-center bg-green-100 text-green-800 text-3xl font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 mr-1 fill-green-500">
              <path fill-rule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clip-rule="evenodd" />
            </svg>
            <!-- <span class="text-sm">{{ host }}</span> -->
            <span class="text-sm">Layout API</span>
            </span>
          </button>      
        </template>
        <template v-else>
            <span class="inline-flex items-center bg-red-100 text-red-800 text-3xl font-medium mr-2 px-8 py-1 rounded-full dark:bg-red-900 dark:text-red-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 mr-1 fill-red-600">
                <path fill-rule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm">Disconnected</span>
            </span>
        </template>
      </div>
      <template v-if="connStatus">
        <div class="flex flex-col items-center justify-center h-full">

        <router-link
          to="/connect/layoutapi"
          custom
          v-slot="{ navigate }"
        >
          <button
            @click="navigate"
            role="link"
            class="btn btn-primary"
          >
          Connect
          </button>
        </router-link>
          <button class="mt-4 btn bg-gradient-to-br from-lime-500 to-blue-500 text-gray-800 text-lg btn-wide btn-lg">Select Layout</button>
        </div>
      </template>
      <template v-else>
        <div className="divider"></div> 
        <input type="text" placeholder="API Host" className="input input-bordered input-primary w-full " />
        <div className="divider"></div> 
        <input type="text" placeholder="Port" className="input input-bordered input-primary w-48 " />
        <div className="divider divide-y-8"></div>
        <button class="mt-4 btn bg-gradient-to-br from-lime-500 to-blue-500 text-gray-800 text-lg btn-wide btn-lg">Connect</button>
        <div className="divider">or</div> 
        <ul>
          <li v-for="host in availableHosts" :key="host">
            <button class="btn btn-sm btn-outline w-full border-teal-500" :value="host" @click="handleHostClick">{{ host }}</button>
            <div className="divider"></div> 
          </li>
        </ul>
      </template>
    </main>
  </main>
</template>

<style>

</style>
