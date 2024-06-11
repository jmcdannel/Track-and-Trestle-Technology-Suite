<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import ConnectionStatus from '../../core/ConnectionStatus.component.vue'
  import useDcc from '../../api/dccApi'
  import router from '../../router'
  import { useConnectionStore } from '../../store/connectionStore.jsx'

  const dccApi = useDcc()
  const conn = useConnectionStore()
  const { ports, serialConnected } = storeToRefs(conn)
  const dccStatus = ref(serialConnected.value ? 'connected' : 'disconnected')

  const handleRefreshClick = () => {
    dccApi.send('listPorts', { });
  }

  const handlePortClick = async (e:any) => {
    try {
      e.preventDefault()
      dccStatus.value = 'pending'
      const serial = e.target.value
      dccApi.send('connect', { serial })
    } catch (err) {
      console.error(err)
    }
  }

  watch(serialConnected, (newValue) => {
    if (newValue && dccStatus.value === 'pending') {
      router.push({ name: 'home' });
    }
  })

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
      <div class="p-2 text-error">
          <ConnectionStatus connectedLabel="DCC-EX" disconnectedLabel="DCC-EX" :connected="conn.serialConnected" />
          <ConnectionStatus connectedLabel="MQTT" disconnectedLabel="MQTT" :connected="conn.mqttConnected" />
          <button class="btn btn-sm btn-outline  border-blue-500" @click="handleRefreshClick">Refresh</button>
      </div>           
      <div className="divider"></div> 
      <ul>
        <li v-for="port in ports" :key="port">
          <button class="btn btn-sm btn-outline w-full border-teal-500" :value="port" @click="handlePortClick">{{ port }}</button>
          <div className="divider"></div> 
        </li>
      </ul>
    </main>
  </main>
</template>
