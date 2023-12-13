import React, { useContext, useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Throttle from './Throttle';
import MiniThrottle from './MiniThrottle';
import AvailableThrottle from './AvailableThrottle';
import { Context } from '../Store/Store';
import jmriApi from '../Shared/api/jmriApi';

import './Throttles.scss';

export const Throttles = props => {

  const { max } = props;
  const defaultThrottles = new Array(max).fill({ loco: null });
  const [ throttles, setThrottles ] = useState(defaultThrottles);
  const [ state, dispatch ] = useContext(Context);
  const { locos } = state;

  const computedThrottles = useCallback(() => {
    const findLocoForThrottle = (locos, throttleIdx) => locos
      .sort((objA, objB) => Number(objA.lastAcquired) - Number(objB.lastAcquired))
      .find(loco => loco.isAcquired && !loco.cruiseControl && loco.throttleIdx === throttleIdx);
  
    return throttles.map((throttle, throttleIdx) => ({
      ...throttle,
      loco: findLocoForThrottle(locos, throttleIdx)
    }));
  }, [locos]);

  useEffect(() => {
    setThrottles(computedThrottles());
  }, [computedThrottles]);

  const computedThrottleClassName = throttle => {
    const stateClassName = `throttle-container--${throttle?.loco?.isAcquired ? 'acquired' : 'empty'}`;
    const classNames = [
      'throttle-container',
      `throttle-container--size-${max}`,
      stateClassName
    ];
    return classNames.join(' ');
  }

  const renderAvailableThrottles = throttleIdx => locos
    ?.filter(loco => !loco.isAcquired)
    .map(loco => 
      <Box key={loco.address} className="throttles--available">
        <AvailableThrottle throttleIdx={throttleIdx} loco={loco} disabled={false}/>
      </Box>
    );
  
  return (
    <>
      <Box
        className=""
        flexGrow={0} 
        display="flex" 
        flexDirection="row" 
        flexWrap="wrap">
        {throttles?.length 
          ? throttles.map((throttle, throttleIdx) => (
              <Box flexGrow={1} className={computedThrottleClassName(throttle)} key={throttleIdx}>
                {throttle?.loco && !throttle.loco.cruiseControl
                  ? <Throttle loco={throttle.loco} />
                  : renderAvailableThrottles(throttleIdx)}
              </Box>
            ))
          : (<>Loading...</>)}
        </Box>
      </>
  );
    
}

Throttles.defaultProps = {
  max: 2
};


export default Throttles;