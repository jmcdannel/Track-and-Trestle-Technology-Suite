import React, { useContext, useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Throttle from './Throttle';
import MiniThrottle from './MiniThrottle';
import AvailableThrottle from './AvailableThrottle';
import { Context } from '../Store/Store';
import jmriApi from '../Shared/jmri/jmriApi';

import './Throttles.scss';

export const Throttles = props => {

  const { max } = props;
  const defaultThrottles = new Array(max).fill({ loco: null });
  const [ throttles, setThrottles ] = useState(defaultThrottles);
  const [ state, dispatch ] = useContext(Context);
  const { locos } = state;
  const cruiseLocos = locos?.filter(loco => loco.cruiseControl);


  const handleCruiseClick = async loco => {
    console.log('handleCruiseClick', loco, loco.throttleIdx);

    const availableThrottleIdx = throttles.findIndex(t => !t.loco);
    const currentLoco = throttles[loco.throttleIdx].loco;
    let newThrottleIdx = loco.throttleIdx;
    if (!!currentLoco) {
      if (availableThrottleIdx > -1) {
        newThrottleIdx = availableThrottleIdx;
      } else {
        await dispatch({ type: 'UPDATE_LOCO', payload: { address: currentLoco.address, cruiseControl: true } });        
      }
    }
    await dispatch({ type: 'UPDATE_LOCO', payload: { address: loco.address, cruiseControl: false, throttleIdx: newThrottleIdx } });
  }

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

  const renderThrottle = ({ loco }, throttleIdx) => {
    return !!(loco && !loco.cruiseControl) ? (
          <Throttle 
            jmriApi={jmriApi} 
            loco={loco}
          />
        ) : renderAvailableThrorttles(throttleIdx);
  }

  const renderAvailableThrorttles = throttleIdx => locos?.filter(loco => !loco.isAcquired).map(loco => 
    <Box key={loco.address} className="throttles--available">
      <AvailableThrottle throttleIdx={throttleIdx} loco={loco} disabled={false}/>
    </Box>
  );

  const computedThrottleClassName = throttle => {
    const stateClassName = `throttle-container--${!!throttle.loco && throttle.loco.isAcquired ? 'acquired' : 'empty'}`;
    const classNames = [
      'throttle-container',
      `throttle-container--size-${max}`,
      stateClassName
    ];
    return classNames.join(' ');
  }
  
  return (
    <Box display="flex" flexDirection="column" flexGrow={1}>
      <Box 
        flexGrow={1} 
        display="flex" 
        flexDirection="row" 
        >
        {throttles.map((throttle, throttleIdx) => (
          <Box className={computedThrottleClassName(throttle)} key={throttleIdx}>
            {renderThrottle(throttle, throttleIdx)}
          </Box>
        ))}
      </Box>
      {cruiseLocos && (
        <Box 
          flexGrow={0} 
          display="flex" 
          flexDirection="row" 
          flexWrap="wrap"
          >
            {cruiseLocos.map(loco => (
              <Box key={loco.address} sx={{ padding: '5px 25px', flexBasis: '50%' }}>
                <MiniThrottle loco={loco} jmriApi={jmriApi} disabled={false} onLocoClick={handleCruiseClick} />
              </Box>
            ))}
        </Box>
      )}
    </Box>
  );
}

Throttles.defaultProps = {
  max: 2
};


export default Throttles;