import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../Store/Store';
import { usePrevious } from '../Shared/Hooks/usePrevious';
import dccApi from '../Shared/api/dccApi';

export const DccExThrottleController = props => {

    const { speed, address, consist } = props;

    const [ , dispatch ] = useContext(Context);
    const prevSpeed = usePrevious(speed);

    useEffect(async () => {
      if (!address) {
        // TODO: handle error
        return;
      }
      if (prevSpeed === speed) {
        // no change
        return;
      }
      console.log('[DccExThrottleController]', speed, prevSpeed, address);
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
        console.log('[DccExThrottleController] sendLocoSpeed', speed, consist);
        await dccApi.setSpeed(address, speed);
        if (consist) {
          consist.forEach(async (consistAddress) => {
            await dccApi.setSpeed(Math.abs(consistAddress), speed);
          });
        }
        await dispatch({ type: 'UPDATE_LOCO', payload: { address, speed } });

      }, delay);

    }, [speed, prevSpeed, address, consist]);


    return (<></>)
}

export default DccExThrottleController;
