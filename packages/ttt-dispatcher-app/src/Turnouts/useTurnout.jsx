import React from 'react';
// import actionApi from '../Shared/api/actionApi';
// import dccApi from '../Shared/api/dccApiMQTT';
import { useTurnoutStore } from '../Store/useTurnoutStore';
import useLayoutEffect from '../Effects/useLayoutEffect';
import { useMqtt } from '../Core/Com/MqttProvider'
import { useDcc } from '../Dcc/useDcc'
import { useConnectionStore } from '../Store/useConnectionStore';

export function useTurnout() {

  const layoutId = useConnectionStore(state => state.layoutId);
  const updateTurnoutState = useTurnoutStore(state => state.updateTurnout);
  const { updateEffect, getEffectbyId } = useLayoutEffect();
  const { publish } = useMqtt();
  const { setTurnout } = useDcc()

  const macroDelay = 3000
  function delay(t, data) {
    return new Promise(resolve => {
        setTimeout(resolve.bind(null, data), t);
    });
  }

  async function updateTurnout(turnout) {
    try {
      console.log('API.updateTurnout', turnout);
      if (turnout?.config?.effectId) {
        const efx = {...await getEffectbyId(turnout.config.effectId), state: turnout.state }
        const newState = efx?.type !== 'signal'
          ? turnout.state
          : turnout.state ? 'green' : 'red';
        efx.state = newState;
        await updateEffect(efx).then(delay.bind(null, macroDelay))
      }
      await handleTurnout(turnout)
    } catch (error) {
      console.error('API.updateTurnout', error, turnout);
    }
  }
  
  async function handleTurnout(turnout) {
    updateTurnoutState(turnout)
    switch(turnout?.config?.interface) {
      case 'dcc-js-api':
        setTurnout(turnout.config.dccExId, turnout.state);
        break;
      case 'mqtt':
        publish(`@ttt/turnout/${layoutId}`, JSON.stringify({ turnout }));
        break;
      case 'betatrack-io':
      case 'tamarack-junction-station-south-io':
      case 'serial':
      case 'action-api':
        // actionApi.turnouts.put(turnout);
        publish(`@ttt/turnout/${layoutId}`, JSON.stringify({ 
          action: 'turnouts',
          payload: turnout 
        }));
        break;
      default:
        console.warn('Unknown interface type', turnout?.config?.interface, turnout);
        break;
      }
    }

  return {
    updateTurnout
  }
}

export default useTurnout