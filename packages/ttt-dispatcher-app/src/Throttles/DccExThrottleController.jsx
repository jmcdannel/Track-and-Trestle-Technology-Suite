import React, { useEffect } from 'react';
import { usePrevious } from '../Shared/Hooks/usePrevious';
import { useThrottleStore } from '../Store/useThrottleStore';
import { useLocoStore } from '../Store/useLocoStore';
import { useConnectionStore } from '../Store/useConnectionStore';
import { useMqtt } from '../Core/Com/MqttProvider'

const SWITCH_DIR_DELAY = 250;

export const DccExThrottleController = props => {

    const { speed, address, consist } = props;

    const layoutId = useConnectionStore(state => state.layoutId);
    const upsertThrottle = useThrottleStore(state => state.upsertThrottle);
    const updateLoco = useLocoStore(state => state.updateLoco);
    const { publish } = useMqtt();
    const prevSpeed = usePrevious(speed);

    const publishSepeed = (address, speed, enableThrottleUpsert = true) => {
      publish(`@ttt/dcc/${layoutId}`, JSON.stringify({
        action: 'throttle',
        payload: { address, speed }
      }))
      if (enableThrottleUpsert) {
        upsertThrottle({ address, speed });
      }
    }

    useEffect(async () => {
      const setConsist = async () => {
        consist.forEach(async (consistAddress) => {
          publishSepeed(Math.abs(consistAddress), consistAddress > 0 ? speed : -speed, false)
        });
      }
      const stopConsist = async () => {
        consist.forEach(async (consistAddress) => {
          publishSepeed(Math.abs(consistAddress), 0, false);
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
        publishSepeed(address, 0); // stop
        consist && stopConsist(consist);
        delay = SWITCH_DIR_DELAY;
      } else if (speed < 0 && prevSpeed > 0) {
        //change direction to reverse
        console.log('[DccExThrottleController] change direction to reverse');
        publishSepeed(address, 0); // stop
        consist && stopConsist(consist);
        delay = SWITCH_DIR_DELAY;
      }
      setTimeout(async () => {
        console.log('[DccExThrottleController] sendLocoSpeed', speed, consist);
        publishSepeed(address, speed);
        consist && setConsist(consist);
        updateLoco({ address, speed });

      }, delay);

    }, [speed, prevSpeed, address, consist]);


    return (<></>)
}

export default DccExThrottleController;
