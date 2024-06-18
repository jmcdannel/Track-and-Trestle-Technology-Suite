import { FunctionComponent, createRef } from "preact"
import { useEffect } from 'preact/hooks'
import { log, clearLog, DccLogType } from "../../stores/DccStore"
import { DccLogItem } from "./DccLogItem"
import XCircle from '../../assets/icons/x-circle'

const AlwaysScrollToBottom = () => {
  const elementRef = createRef();
  useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
};

export const DccLog: FunctionComponent = () => {


  const ignore = ['<jI'];
  const ignoreFilter = (item:DccLogType) => {
    return !ignore.some(i => item?.message.startsWith(i));
  }

  return (
    <>
      <button onClick={clearLog} className="
      bg-transparent
      
      ">
        <XCircle className="
          w-8 
          h-8 
          p-1 
          bg-indigo-400 
          rounded-full 
          absolute 
          -top-1
          -right-1
        " /></button>
      <div className="flex flex-col mt-2 max-h-80 overflow-y-auto">
        {[...log.value].filter(ignoreFilter).map((item, idx) => (
          // <pre key={`log${idx}`} className="slide-in-left">{message}</pre>
          <DccLogItem key={`log${idx}`} item={item} />
        ))}
        <AlwaysScrollToBottom />
      </div>
    </>
  )

}

export default DccLog