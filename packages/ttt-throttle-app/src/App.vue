<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { RouterView } from 'vue-router'
  import { useMQTT } from 'mqtt-vue-hook'
  import HeaderView from './views/HeaderView.vue'
  // import FooterView from './views/FooterView.vue'
  import useDcc from './api/dccApi'
  import { useConnectionStore } from './store/connectionStore'
  
  const mqttBroker = import.meta.env.VITE_MQTT_BROKER
  const mqttPort = 8081

  const dccApi = useDcc()
  const mqttHook = useMQTT()
  const conn = useConnectionStore()

  const { layoutId } = storeToRefs(conn)
  const dejaTopic = ref(`@ttt/DCCEX.js/${layoutId.value}`)
  
  onMounted(async () => {
    try {
      console.log('CONNECTING TO MQTT BROKER', mqttBroker, layoutId?.value, dejaTopic.value)
      mqttHook.registerEvent(
        dejaTopic,
        (topic: string, message: string) => {
          dccApi.parseMessage(topic, message.toString())
        },
        'string_key',
      )      
      mqttHook.registerEvent(
          'on-connect', // mqtt status: on-connect, on-reconnect, on-disconnect, on-connect-fail
          (_topic: string, message: string) => {
              console.log('MQTT BROKER CONNECTION SUCCESSFUL')
              mqttHook.subscribe([dejaTopic.value])
              conn.$patch({ mqttConnected: true })
              dccApi.send('listPorts', { })
              dccApi.send('getStatus', { })
          },
          'string_key',
      )
      await mqttHook.connect(mqttBroker, { port: mqttPort })
    } catch (err) {
      console.error(err);
    }
  });

</script>

<template>
  <main class="flex flex-col h-screen">
    <HeaderView />
    <main class="flex-grow flex mb-16">
      <RouterView />
    </main>
    <!-- <FooterView /> -->
  </main>
</template>
