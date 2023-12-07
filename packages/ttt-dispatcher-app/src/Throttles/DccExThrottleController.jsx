import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../Store/Store';
import { usePrevious } from '../Shared/Hooks/usePrevious';
import dccApi from '../Shared/api/dccApi';

export const DccExThrottleController = props => {

    const { speed, forward, address } = props;

    const [ , dispatch ] = useContext(Context);
    const prevSpeed = usePrevious(speed);

    useEffect(async () => {
      console.log('[DccExThrottleController]', speed, prevSpeed, address);
      if (!address) {
        // TODO: handle error
        return;
      }
      let delay = 0;
      if (speed > 0 && prevSpeed < 0) {
        //change direction to forward
        console.log('[DccExThrottleController] change direction to forward');
        await dccApi.setSpeed(address, 0); // stop
        delay = SWITCH_DIR_DELAY;
      } else if (speed < 0 && prevSpeed > 0) {
        //change direction to reverse
        console.log('[DccExThrottleController] change direction to reverse');
        await dccApi.setSpeed(address, 0); // stop
        delay = SWITCH_DIR_DELAY;
      }
      setTimeout(async () => {
        console.log('[DccExThrottleController] sendLocoSpeed', speed);
        await dccApi.setSpeed(address, speed);
        await dispatch({ type: 'UPDATE_LOCO', payload: { address, speed } });

      }, delay);

    }, [speed, prevSpeed, address]);


    return (<></>)
}

export default DccExThrottleController;
