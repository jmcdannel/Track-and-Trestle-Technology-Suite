import React, { useContext, useEffect, useState } from 'react';
import api from '../Shared/api/api';
import { Context } from '../Store/Store';
import log from '../Shared/utils/logger';
import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';
import { useDccStore } from '../Store/useDccStore';
import { useThrottleStore } from '../Store/useThrottleStore';
import { DccListener } from '../Dcc/DccListener';

function ApiEngine() {

  const [client, setClient] = useState(null)
  const [isSubed, setIsSub] = useState(false)
  const [payload, setPayload] = useState({})
  const [connectStatus, setConnectStatus] = useState('Connect')

  const [ state, dispatch ] = useContext(Context);
  const { layout } = state;

  const host = useConnectionStore(state => state.host);
  const layoutId = useConnectionStore(state => state.layoutId);
  const setStatus = useConnectionStore(state => state.setStatus);

  const actionApiStatus = useConnectionStore(state => state.actionApiStatus);
  const actionDevices = useConnectionStore(state => state.actionDevices);
  const addActionDevice = useConnectionStore(state => state.addActionDevice);
  const updateActionDeviceStatusByPort = useConnectionStore(state => state.updateActionDeviceStatusByPort);
  
  const setActionApiStatus = useConnectionStore(state => state.setActionApiStatus);
  const resetConnectionStatus = useConnectionStore(state => state.resetConnectionStatus);

  const setActionPorts = useConnectionStore(state => state.setActionPorts);

  const handleActionMessage = (message) => {
    try {
      const { success, data } = JSON.parse(message.data);
      const { action, payload } = data;
      console.log('[ApiEngine] handleActionMessage', success, data, action, payload, message);
      switch (action) {
        case 'ports':
          setActionPorts(payload);
          break;
        case 'socketConnected':
          setActionApiStatus(CONNECTION_STATUS.CONNECTED);
          break;
        case 'connected':
          updateActionDeviceStatusByPort(payload.serial, CONNECTION_STATUS.CONNECTED);
          break;
      }
    } catch (err) { 
      setActionApiStatus(CONNECTION_STATUS.DISCONNECTED);
      console.error('[ApiEngine] handleActionMessage error', err); 
    }
  }

  // Connect Host
  useEffect(() => {
    const initialize = async function() {
      try {
        setStatus(CONNECTION_STATUS.PENDING);
        resetConnectionStatus();
        const result = await api.connect(dispatch, host, layoutId);
        setStatus(result 
          ? CONNECTION_STATUS.CONNECTED
          : CONNECTION_STATUS.DISCONNECTED);
      } catch (err) {
        log.error('api initialization error', err);
      }
    };    
    host && initialize();
    !host && setStatus(CONNECTION_STATUS.DISCONNECTED);
    !layoutId && setStatus(CONNECTION_STATUS.DISCONNECTED);
  }, [host, layoutId]);

  // Connect Host Interfaces
  useEffect(() => {
    console.log('[ApiEngine] layout', layout);
    if (layout?.interfaces?.find(i => i.type === 'action-api')) {
      setActionApiStatus(CONNECTION_STATUS.PENDING);
      api.actionApi.connect(host, handleActionMessage);
    }
  }, [layout]);

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

    actionApiStatus === CONNECTION_STATUS.CONNECTED 
      && actionDevices.length === 0
      && initialize();
  }, [actionApiStatus, actionDevices, layout]);

  // Connect Action Device(s)
  useEffect(() => {
    console.log('[ApiEngine] Connect Action Device(s)', actionApiStatus, actionDevices, layout);
    if (actionApiStatus === CONNECTION_STATUS.CONNECTED) {
      actionDevices
        .filter(d => d.status === CONNECTION_STATUS.DISCONNECTED || d.status === CONNECTION_STATUS.UNKNOWN)
        .map(async device => {
          try {
            const result = await api.actionApi.connectDevice(device.port);
            console.log('[ApiEngine] actionApi connectDevice result', device, result);
          } catch (err) {
            log.error('action device initialization error', err);
          }
        });
    }
  }, [actionApiStatus, actionDevices]);

  return (<><DccListener /></>);
}

export default ApiEngine;