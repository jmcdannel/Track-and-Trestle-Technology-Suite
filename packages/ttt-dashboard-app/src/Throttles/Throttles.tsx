import { FunctionComponent } from "preact"
import { throttles, clearLog } from "../stores/ThrottleStore"

export const Throttles: FunctionComponent = () => {

  return (
    <>
      <button onClick={clearLog}>Clear Log</button>
      <div className="mt-2 flex flex-col-reverse max-h-80 overflow-y-auto">
        {[...throttles.value].map((throttle, idx) => (
          <div key={`throttles${idx}`} className="slide-in-left p-2 mb-1 bg-indigo-800 rounded-xl flex items-center justify-between shadow-md ">
            <span className=" bg-cyan-950 text-white rounded-lg min-w-32 text-center px-3 py-1 ring-1 ring-slate-400 ring-offset-2 ring-offset-slate-900">{throttle.address}</span>
            <span className="bg-gray-800 p-3 rounded-lg text-lime-400 font-bold border-solid border-white ring-1 shadow-inner shadow-slate-700">{throttle.speed}</span>
          </div>
        ))}
      </div>
    </>
  )

}

export default Throttles