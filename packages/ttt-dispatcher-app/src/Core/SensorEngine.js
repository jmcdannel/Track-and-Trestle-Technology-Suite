import React, { useContext, useEffect, useCallback } from 'react';
import { Context } from '../Store/Store';
import api from '../Api';
import log from '../Shared/utils/logger';

function SensorEngine(props) {

  const { jmriApi } = props;
  const [ state ] = useContext(Context);
  const { sensors } = state;

  const handleSensor = useCallback(({ name, inverted, state }) => {
    const setSignal = (action, actionState) => {
      if (actionState === 4) {
        api.signals.put({ 
          signalId: action.signalId, 
          state: actionState === 4 ? 1 :0 
        });
      }
      return action;
    }
    const sensor = sensors.find(sensor => sensor.pin === parseInt(name.substring(2)));
    sensor.HIGH.map(sensorAction => setSignal(sensorAction, state));
    sensor.LOW.map(sensorAction => setSignal(sensorAction, state));
  }, [sensors]);

  useEffect(() => {
    log.info('watchSensors', sensors);
    if (sensors && jmriApi) {
      jmriApi.watchSensors([...sensors]);
      jmriApi.on('sensor', 'TrackMaster', handleSensor);
    }
  }, [jmriApi, sensors, handleSensor]);

  return (<></>);
}

export default SensorEngine;