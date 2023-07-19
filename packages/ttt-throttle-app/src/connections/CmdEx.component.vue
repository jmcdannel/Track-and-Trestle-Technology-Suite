<script setup lang="ts">
  import { ref } from 'vue';

  const port = ref(null);
  
  const props = defineProps({
    iface: {
        type: Object
    }
  });

  const connected = ref(false);

  function handleConnection(e:any) {
    connected.value = e.state;
    port.value = e.port;

    console.log('handleConnection', e, e.port);
    // create a text encoder output stream and pipe the stream to port.writeable
    const encoder = new TextEncoderStream();
    outputDone = encoder.readable.pipeTo(e.port.writable);
    outputStream = encoder.writable;
  }

  function writeToStream(...lines:any[]) {
    // Stops data being written to nonexistent port if using emulator
    let stream:any = null;
    if (port) {
      stream = outputStream.getWriter();
    }

    lines.forEach((line) => {
        if (line == "\x03" || line == "echo(false);") {

        } else {
            console.log('[SEND]'+line.toString());
        }
        const packet = `${line}\n`;
        stream.write(packet)
        console.log(packet)
    });
    stream.releaseLock();
  }

  async function connect() {
    try {
      const port = await navigator.serial.requestPort(); // prompt user to select device connected to a com port
      await port.open({ baudRate: 115200 });         // open the port at the proper supported baud rate
      connected.value = true;
      // emitConn('connection', { state: connected.value, port });
    } catch (err) {
      console.error('SERIAL failed', err);
    }
  }
</script>

<template>
  <main>
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-purple-400 text-opacity-75">{{ iface?.device }}</h2>
        <pre>{{ iface?.serial }}</pre>
        <p>
          Status:
          <strong v-if="connected" class="text-green-600 text-opacity-75">CONNECTED</strong>
          <strong v-else class="text-red-600 text-opacity-75">NOT CONNECTED</strong>
        </p>
        <div class="card-actions justify-end">
          <button v-if="connected" class="btn btn-secondary btn-sm">Reset</button>
          <button v-else class="btn btn-primary btn-sm" @click="connect">Connect</button>
        </div>
      </div>
    </div>
  </main>
</template>
