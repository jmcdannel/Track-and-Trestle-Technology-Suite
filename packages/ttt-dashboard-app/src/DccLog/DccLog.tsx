import { FunctionComponent } from "preact"
import { log, clearLog } from "../stores/DccStore"
import { DccLogItem } from "./DccLogItem"

export const DccLog: FunctionComponent = () => {

  return (
    <>
      {/* <button onClick={() => onClear()}>Clear Log</button> */}
      <div className="flex flex-col-reverse max-h-80 overflow-y-auto">
        {[...log.value].map(({ message }, idx) => (
          <pre key={`log${idx}`} className="slide-in-left">{message}</pre>
          // <DccLogItem key={line.id} item={line} />
        ))}
      </div>
    </>
  )

}

export default DccLog