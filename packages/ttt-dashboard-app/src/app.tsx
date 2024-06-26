import { useEffect, useState } from 'preact/hooks'
import CurrentMonitor from './components/CurrentMonitor'
import SelectLayout from './components/SelectLayout'
import DccConnector from './components/DccConnector'
import DccLog from './components/DccLog/DccLog';
import Throttles from './components/Throttles'
import LayoutInfo from './components/LayoutInfo'
import './app.css'

export function App() {

  const [layoutId, setLayoutId] = useState<string | null>(window.localStorage.getItem('layoutId') || null)

  useEffect(() => {
    if (layoutId) {
      window.localStorage.setItem('layoutId', layoutId)
    } else {
      window.localStorage.removeItem('layoutId')
    }
  }, [layoutId])

  return layoutId 
    ? (
      <>
        <DccConnector layoutId={layoutId} />
        <div class="container justify-between flex flex-col h-full mx-auto">
          <header class="flex items-center justify-between my-3 px-4 py-2 bg-slate-800 rounded-3xl bg-gradient-to-r from-teal-600 to-indigo-500">
            <h1 class="text-3xl">TTT Dashboard</h1>
            <div>
              <p>{layoutId}</p>
              <button onClick={() => setLayoutId(null)}>Clear</button>
            </div>
          </header>
          <main class="grid gap-4 grid-cols-2 flex-1  h-full">
            <section class="relative bg-stone-600 p-8 rounded-3xl bg-gradient-to-r from-violet-500 to-fuchsia-500">
              <DccLog />
            </section>
            <section class="relative bg-stone-600 p-8 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500">
              <LayoutInfo />
            </section>
            <section class="relative bg-stone-600 p-8 rounded-3xl bg-gradient-to-r  from-green-600 to-indigo-700">
             <Throttles />
            </section>
            <section class="relative bg-stone-600 p-8 rounded-3xl bg-gradient-to-r from-pink-500 to-violet-500">
              {/* Turnouts */}
              <CurrentMonitor layoutId={layoutId} />
            </section>
          </main>
        </div>
      </>
    ) : (
      <SelectLayout onSelected={setLayoutId} />
    )
}

