import { FunctionComponent } from "preact";
import { useState, useEffect } from 'preact/hooks'
import mqtt, { MqttClient } from "mqtt";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js';
import { Line } from 'react-chartjs-2'

// const mqttBroker = 'mqtt://joshs-mac-mini.local'
// const mqttPort = 5005
const mqttBroker = 'mqtt://test.mosquitto.org'
const mqttPort = 8081
const pollIntervalMS = 2000

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
)

const options = {
  responsive: true,
  animation: { duration: 0 },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const initialZeros = Array.from({ length: 20 }).map(() => 0);

const CurrentMonitor: FunctionComponent = () => {
  const [current, setCurrent] = useState(0)
  const [chistory, setChistory] = useState(initialZeros)
  const [mqttClient, setMqttClient] = useState<MqttClient | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const visibleHistory = chistory.slice(-20)
  const historyChartData = {
    labels: Array.from({ length: visibleHistory.length }).map((_, i) => i),
    datasets: [
      {
        data: visibleHistory,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  function parseMqttMessage({ action, payload }: { action: string, payload: any }) {
    switch (action) {
      case 'broadcast':
        if (payload.startsWith('<jI ')) {
          const currentData = payload.split(' ')
          console.log('currentData:', currentData)
          setCurrent(parseInt(currentData[1]))
          setChistory(prevState => [...prevState, currentData[1]])
        }
        break
      default:
        console.log('default:', payload)
        break
    }

  }

  useEffect(() => {
    setMqttClient(mqtt.connect(mqttBroker, { port: mqttPort }))
  }, [])

  useEffect(() => {
    isConnected && setInterval(() => {
      mqttClient?.publish('@ttt/dccex', JSON.stringify({ action: 'dcc', payload: 'JI'}))
    }, pollIntervalMS)
  }, [isConnected])

  useEffect(() => {
    if (mqttClient) {
      mqttClient.on('connect', () => {
        console.log('[mqttClient] connection successful')
        setIsConnected(true)
      })
      mqttClient.on('message', (topic, message) => {
        parseMqttMessage(JSON.parse(message.toString()))
        console.log(`mqttClient received message:`,topic, message.toString())
      })
      mqttClient.subscribe('@ttt/DCCEX.js')
    }
  }, [mqttClient])

  return (
    <div class="flex flex-col items-center">
      <Line options={options} data={historyChartData} />
      <div class="
        border-2
        px-24 
        py-4 
        rounded-2xl 
        border-cyan-500 
        bg-cyan-950 
        text-3xl 
        text-green-500
        
      ">
        {current}
      </div>
    </div>
  )
}

export default CurrentMonitor
