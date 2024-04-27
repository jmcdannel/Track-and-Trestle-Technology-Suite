import { FunctionComponent } from "preact"
import { throttles, clearLog } from "../stores/ThrottleStore"

export const Throttles: FunctionComponent = () => {

  return (
    <>
      <button onClick={clearLog}>Clear Log</button>
      <div className="flex flex-col-reverse max-h-80 overflow-y-auto">
        {[...throttles.value].map(( throttle , idx) => (
          <div key={`throttles${idx}`} className="slide-in-left">
            <span>{throttle.address}</span> - 
            <span>{throttle.speed}</span>
          </div>
        ))}
      </div>
    </>
  )

}

export default Throttles