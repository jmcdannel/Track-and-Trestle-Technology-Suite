import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../Store/Store';
import { usePrevious } from '../Shared/Hooks/usePrevious';
import dccApi from '../Shared/api/dccApi';

const SWITCH_DIR_DELAY = 250;

export const DccExThrottleController = props => {

    const { speed, address, consist } = props;

    const [ , dispatch ] = useContext(Context);
    const prevSpeed = usePrevious(speed);

    useEffect(async () => {
      const setConsist = async () => {
        consist.forEach(async (consistAddress) => {
          await dccApi.setSpeed(Math.abs(consistAddress), consistAddress > 0 ? speed : -speed);
        });
      }
      const stopConsist = async () => {
        consist.forEach(async (consistAddress) => {
          await dccApi.setSpeed(Math.abs(consistAddress), 0);
        });
      }
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
        consist && stopConsist(consist);
        delay = SWITCH_DIR_DELAY;
      } else if (speed < 0 && prevSpeed > 0) {
        //change direction to reverse
        console.log('[DccExThrottleController] change direction to reverse');
        await dccApi.setSpeed(address, 0); // stop
        consist && stopConsist(consist);
        delay = SWITCH_DIR_DELAY;
      }
      setTimeout(async () => {
        console.log('[DccExThrottleController] sendLocoSpeed', speed, consist);
        await dccApi.setSpeed(address, speed);
        consist && setConsist(consist);
        await dispatch({ type: 'UPDATE_LOCO', payload: { address, speed } });

      }, delay);

    }, [speed, prevSpeed, address, consist]);


    return (<></>)
}

export default DccExThrottleController;
