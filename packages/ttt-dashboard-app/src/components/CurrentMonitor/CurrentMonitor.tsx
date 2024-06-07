import { FunctionComponent } from "preact";
import { useState, useEffect } from 'preact/hooks'
import { currentLog, current } from "../../stores/DccStore"
import { useMqtt } from '../DccConnector/hooks/useMqtt'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js';
import { Line } from 'react-chartjs-2'

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
interface CurrentMonitorProps {
  layoutId: string | null
}

const CurrentMonitor: FunctionComponent<CurrentMonitorProps> = ({ layoutId }) => {

  const { isConnected, publish } = useMqtt();

  const visibleHistory = currentLog.value.slice(-20)
  const historyChartData = {
    labels: Array.from({ length: visibleHistory.length }).map((_, i) => i),
    datasets: [
      {
        data: visibleHistory.map(d => d.current),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };
  
  console.log(currentLog.value)

  
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
        {current}, [{isConnected.toString()}]
      </div>
    </div>
  )
}

export default CurrentMonitor
