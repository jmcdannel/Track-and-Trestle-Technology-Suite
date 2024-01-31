import React from 'react';
// import actionApi from '../Shared/api/actionApi';
// import dccApi from '../Shared/api/dccApiMQTT';
import { useTurnoutStore } from '../Store/useTurnoutStore';
import { useMqtt } from '../Core/Com/MqttProvider'
import { useDcc } from '../Dcc/useDcc'

export function useTurnout() {

  const updateTurnoutState = useTurnoutStore(state => state.updateTurnout);
  const { publish } = useMqtt();
  const { setTurnout } = useDcc()

  async function updateTurnout(turnout) {
    console.log('API.updateTurnout', turnout);
    updateTurnoutState(turnout)
    switch(turnout?.config?.interface) {
      case 'dcc-js-api':
        setTurnout(turnout.config.dccExId, turnout.state);
        break;
      case 'mqtt':
        publish('ttt-turnout', JSON.stringify({ turnout }));
        break;
      case 'betatrack-io':
      case 'tamarack-junction-station-south-io':
      case 'serial':
      case 'action-api':
        // actionApi.turnouts.put(turnout);
        publish('ttt-turnout', JSON.stringify({ 
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