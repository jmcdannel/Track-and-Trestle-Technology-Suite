import React, { useContext, useEffect, useState } from 'react';
import useLayoutApi from '../../Shared/api/useLayoutApi';
import log from '../../Shared/utils/logger';
import { useConnectionStore, CONNECTION_STATUS } from '../../Store/useConnectionStore';
import { useEffectStore } from '../../Store/useEffectStore';
import { useLocoStore } from '../../Store/useLocoStore';
import { useLayoutStore } from '../../Store/useLayoutStore';
import { useRouteStore } from '../../Store/useRouteStore';
import { useTurnoutStore } from '../../Store/useTurnoutStore';
import { useMqtt } from './MqttProvider'
import { DccListener } from '../../Dcc/DccListener';


function ApiEngine() {

  const mqtt = useMqtt();

  const layoutId = useConnectionStore(state => state.layoutId);
  const setStatus = useConnectionStore(state => state.setStatus);
  const dccDevice = useConnectionStore(state => state.dccDevice);

  const { getByType } = useLayoutApi();
  const initLocos = useLocoStore(state => state.initLocos);
  const initEffects = useEffectStore(state => state.initEffects);
  const initTurnouts = useTurnoutStore(state => state.initTurnouts);
  const initLayouts = useLayoutStore(state => state.initLayouts);
  const initRoutes = useRouteStore(state => state.initRoutes);

  const layout = useLayoutStore(state => state.layout);

  const actionDevices = useConnectionStore(state => state.actionDevices);
  const setDccDeviceStatus = useConnectionStore(state => state.setDccDeviceStatus);
  const addActionDevice = useConnectionStore(state => state.addActionDevice);
  const setPorts = useConnectionStore(state => state.setPorts);
  const updateActionDeviceStatusByPort = useConnectionStore(state => state.updateActionDeviceStatusByPort);
  
  const resetConnectionStatus = useConnectionStore(state => state.resetConnectionStatus);


  const topics = {
    dispatcher: `@ttt/dispatcher/${layoutId}`,
    turnouts: `@ttt/turnouts/${layoutId}`,
  }
  
  const handleMessage = async (message) => {
    try {
      // console.log('[ApiEngine] handleMessage', message);
      const { action, payload } = message.data;
      // console.log('[DccListener] handleDccMessage', action, payload);
      switch (action) {
        case 'ports':
          setPorts(payload);
          break;
        case 'connected':
          console.log('[ApiEngine] connected', payload, dccDevice);
          if (payload.serial === dccDevice) {
            setDccDeviceStatus(CONNECTION_STATUS.CONNECTED);
          } else {
            updateActionDeviceStatusByPort(payload.serial, CONNECTION_STATUS.CONNECTED);
          }
          break;
      }
    } catch (err) { 
      // setDccDeviceStatus(CONNECTION_STATUS.DISCONNECTED);
      console.error('[ApiEngine] handleMessage error', err); 
    }
  }

  // Connect Layout
  useEffect(async () => {
    const initialize = async function() {
      try {
        setStatus(CONNECTION_STATUS.PENDING);
        resetConnectionStatus();
        mqtt.reset();
        mqtt.connect();        
        
        initLayouts(await getByType('layouts'), layoutId);
        initTurnouts(await getByType('turnouts'));
        initLocos(await getByType('locos'));
        initEffects(await getByType('effects'));
        initRoutes(await getByType('routes'));
        setStatus(CONNECTION_STATUS.CONNECTED);
      } catch (err) {
        log.error('[ApiEngine] api initialization error', err);
      }
    }
    layoutId && await initialize();
    !layoutId && setStatus(CONNECTION_STATUS.DISCONNECTED);
  }, [layoutId]);
  
  // Setup MQTT Topics
  useEffect(() => {
    const initialize = async function() {
      try {        
        const msg = { action: 'status', payload: 'ApiEngine connected' };
        mqtt.publish(topics.dispatcher, JSON.stringify(msg));
        mqtt.subscribe(topics.dispatcher);
        mqtt.subscribe(topics.turnouts);
      } catch (err) {
        log.error('mqtt pub/sub error', err);
      }
      
    };    
    layoutId && mqtt.isConnected && initialize();
  }, [mqtt.isConnected, layoutId ]);

  // Initialze Serial Action Device(s)
  useEffect(() => {
    const initialize = async function() {
      try {
        console.log('[ApiEngine] Action Device(s) initialize', actionDevices);    
        layout.interfaces?.filter(i => i.type === 'serial').map(addActionDevice);
      } catch (err) {
        log.error('dcc device initialization error', err);
      }
    };

    mqtt.isConnected
      && actionDevices.length === 0
      && initialize();
  }, [mqtt.isConnected, actionDevices, layout]);

  // Connect Action Device(s)
  useEffect(() => {
    if (mqtt.isConnected && actionDevices.length > 0) {
      console.log('[ApiEngine] Action Device(s) Connect ', mqtt.isConnected, actionDevices);
      actionDevices
        .filter(d => !!d.port && (d.status === CONNECTION_STATUS.DISCONNECTED || d.status === CONNECTION_STATUS.UNKNOWN))
        .map(async device => {
          try {
            mqtt.publish(topics.dispatcher, {
              action: 'connect',
              payload: { serial: device.port, device }
            });
            console.log('[ApiEngine] actionApi connectDevice result', device);
          } catch (err) {
            log.error('action device initialization error', err);
          }
        });
    }
  }, [mqtt.isConnected, actionDevices]);
  
  // handle mqtt messages
  useEffect(() => {
    const parse = function() {
      try {
        if (mqtt.payload?.message) {
          const message = JSON.parse(mqtt.payload.message);
          message && message.data && handleMessage(message);
        }
      } catch (err) {
        log.error('api initialization error', err);
      }
    };    
    // console.log('[ApiEngine] mqtt.payload', mqtt.payload);
    mqtt.payload && parse();
  }, [mqtt.payload]);
    
  return (<><DccListener /></>);
}

export default ApiEngine;