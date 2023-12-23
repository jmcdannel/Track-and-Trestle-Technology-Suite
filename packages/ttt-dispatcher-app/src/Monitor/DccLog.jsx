import React from 'react';
import { useDccStore } from '../Store/useDccStore';
import { useThrottleStore } from '../Store/useThrottleStore';

const DccLog = () => {
  const log = useDccStore(state => state.log);
  const throttles = useThrottleStore(state => state.throttles);
 
  return (
    <div>
      {/* <pre>dccLog: {dccLog}</pre> */}
      {log && log.map((item, idx) => <pre key={`log${idx}`}>{item}</pre>)}
      {throttles && throttles.map((item, idx) => <pre key={`throttles${idx}`}>{JSON.stringify(item)}</pre>)}
    </div>
  );
};

export default DccLog;
