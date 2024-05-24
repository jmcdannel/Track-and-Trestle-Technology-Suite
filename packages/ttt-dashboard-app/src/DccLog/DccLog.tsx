import { FunctionComponent, createRef } from "preact"
import { useEffect } from 'preact/hooks'
import { log, clearLog } from "../stores/DccStore"
import { DccLogItem } from "./DccLogItem"

const AlwaysScrollToBottom = () => {
  const elementRef = createRef();
  useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
};

export const DccLog: FunctionComponent = () => {

  return (
    <>
      <button onClick={clearLog}>Clear Log</button>
      <div className="flex flex-col mt-2 max-h-80 overflow-y-auto">
        {[...log.value].map((item, idx) => (
          // <pre key={`log${idx}`} className="slide-in-left">{message}</pre>
          <DccLogItem key={`log${idx}`} item={item} />
        ))}
        <AlwaysScrollToBottom />
      </div>
    </>
  )

}

export default DccLog