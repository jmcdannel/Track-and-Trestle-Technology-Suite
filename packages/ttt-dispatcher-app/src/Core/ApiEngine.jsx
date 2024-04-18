import React, { useContext, useEffect, useState } from 'react';
import api from '../Shared/api/api';
import useLayoutApi from '../Shared/api/useLayoutApi';
import { Context } from '../Store/Store';
import log from '../Shared/utils/logger';
import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';
import { useDccStore } from '../Store/useDccStore';
import { useEffectStore } from '../Store/useEffectStore';
import { useLocoStore } from '../Store/useLocoStore';
import { useLayoutStore } from '../Store/useLayoutStore';
import { useRouteStore } from '../Store/useRouteStore';
import { useTurnoutStore } from '../Store/useTurnoutStore';
import { useMqtt } from './Com/MqttProvider'
import { DccListener } from '../Dcc/DccListener';

function ApiEngine() {

  const [ state, dispatch ] = useContext(Context);
  const mqtt = useMqtt();

  const host = useConnectionStore(state => state.host);
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

  // Connect Host
  useEffect(async () => {
    const initialize = async function() {
      try {
        setStatus(CONNECTION_STATUS.PENDING);
        resetConnectionStatus();
        mqtt.reset();
        mqtt.connect();
        const result = await api.connect(dispatch, host, layoutId);
        setStatus(result 
          ? CONNECTION_STATUS.CONNECTED
          : CONNECTION_STATUS.DISCONNECTED);
      } catch (err) {
        log.error('[ApiEngine] api initialization error', err);
      }
    };
    const initializeStores = async function() {
      try {
        console.log('initializeStores');
        initLayouts(await getByType('layouts'), layoutId);
        initTurnouts(await getByType('turnouts'));
        initLocos(await getByType('locos'));
        initEffects(await getByType('effects'));
        initRoutes(await getByType('routes'));
      } catch (err) {
        log.error('[ApiEngine] api initialization error', err);
      }
    }
    host && await initialize();
    host && layoutId && await initializeStores();
    !host && setStatus(CONNECTION_STATUS.DISCONNECTED);
    !layoutId && setStatus(CONNECTION_STATUS.DISCONNECTED);
  }, [host, layoutId]);
  
  // Connect MQTT Client
  useEffect(() => {
    const initialize = async function() {
      try {        
        mqtt.publish(`@ttt/dispatcher/${layoutId}`, JSON.stringify({ action: 'status', payload: 'ApiEngine connected' }));
        mqtt.subscribe(`@ttt/dispatcher/${layoutId}`);
        mqtt.subscribe(`@ttt/turnouts/${layoutId}`);
      } catch (err) {
        log.error('mqtt pub/sub error', err);
      }
    };    
    layoutId && mqtt.isConnected && initialize();
  }, [mqtt.isConnected, layoutId ]);

  // Initialze Action Device(s)
  useEffect(() => {
    const initialize = async function() {
      try {
        console.log('[ApiEngine] Action Device(s) initialize', actionDevices);    
        layout?.interfaces?.filter(i => i.type === 'serial').map(addActionDevice);
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
            // const result = await api.actionApi.connectDevice(device.port);
            mqtt.publish(`@ttt/dispatcher/${layoutId}`, {
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