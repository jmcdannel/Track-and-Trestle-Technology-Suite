import React, { useContext, useEffect, useState } from 'react';
// import api from '../Api';
import api from '../Shared/api/api';
import { Context } from '../Store/Store';
import log from '../Shared/utils/logger';
import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';

function ApiEngine(props) {

  const { onReady } = props;
  const [ state, dispatch ] = useContext(Context);
  const { layout } = state;
  const host = useConnectionStore(state => state.host);
  const layoutId = useConnectionStore(state => state.layoutId);
  const setStatus = useConnectionStore(state => state.setStatus);
  const dccHost = useConnectionStore(state => state.dccHost);
  const dccDevice = useConnectionStore(state => state.dccDevice);
  const dccApiStatus = useConnectionStore(state => state.dccApiStatus);
  const dccDeviceStatus = useConnectionStore(state => state.dccDeviceStatus);
  const setDccApiStatus = useConnectionStore(state => state.setDccApiStatus);
  const setDccDevice = useConnectionStore(state => state.setDccDevice);
  const setDccDeviceStatus = useConnectionStore(state => state.setDccDeviceStatus);
  const setDccPorts = useConnectionStore(state => state.setDccPorts);

  const handleDccMessage = (message) => {
    try {
      const { action, payload } = JSON.parse(message.data);
      // const connStore = useConnectionStore();
      console.log('[ApiEngine] handleDccMessage', action, payload, message);
      switch (action) {
        case 'listPorts':
          setDccPorts(payload);
          // await dispatch({ type: 'UPDATE_CONNECTION', payload: { connectionId, ports: payload } });
          break;
        case 'socketConnected':
          setDccApiStatus(CONNECTION_STATUS.CONNECTED);
          break;
        case 'connected':
          console.log('[ApiEngine] onMessage.connected', payload);
          setDccDeviceStatus(CONNECTION_STATUS.CONNECTED);
          setDccDevice(payload.path);
          // await dispatch({ type: 'UPDATE_CONNECTION', payload: { connectionId, connected: true, host } });
          break;
        case 'broadcast':
          // await dispatch({ type: 'DCC_LOG', payload });
          break;
      }
    } catch (err) { 
      setDccApiStatus(CONNECTION_STATUS.DISCONNECTED);
      setDccDeviceStatus(CONNECTION_STATUS.DISCONNECTED);
      console.error('[DCC API] onMessage error', err); 
    }
  }

  useEffect(() => {
    const initialize = async function() {
      try {
        setStatus(CONNECTION_STATUS.CONNECTING);
        const result = await api.connect(dispatch, host, layoutId);
        log.log('[ApiEngine] connect result', result);
        setStatus(result 
          ? CONNECTION_STATUS.CONNECTED
          : CONNECTION_STATUS.DISCONNECTED);
        onReady();
      } catch (err) {
        log.error('api initialization error', err);
      }
    };
    
    host && initialize();

    !host && setStatus(CONNECTION_STATUS.DISCONNECTED);
    !layoutId && setStatus(CONNECTION_STATUS.DISCONNECTED);

  }, [host, layoutId]);

  useEffect(() => {
    const initialize = async function() {
      try {
        setDccApiStatus(CONNECTION_STATUS.CONNECTING);
        const result = await api.dcc.connect(dispatch, host, handleDccMessage);
        log.log('[ApiEngine] dccApi connect result', result);
        setDccApiStatus(result 
          ? CONNECTION_STATUS.CONNECTED
          : CONNECTION_STATUS.DISCONNECTED);
      } catch (err) {
        log.error('dcc api initialization error', err);
      }
    };
    
    dccHost && initialize();
    !dccHost
  }, [dccHost]);

  useEffect(() => {
    const initialize = async function() {
      try {
        setDccDeviceStatus(CONNECTION_STATUS.CONNECTING);
        const result = await api.dcc.connectDevice(dccDevice);
        log.log('[ApiEngine] dccApi connectDevice result', dccDevice, result);
      } catch (err) {
        log.error('dcc device initialization error', err);
      }
    };
    dccApiStatus === CONNECTION_STATUS.CONNECTED 
      && dccDeviceStatus === CONNECTION_STATUS.DISCONNECTED
      && dccDevice 
      && initialize();
    !dccDevice && setDccDeviceStatus(CONNECTION_STATUS.DISCONNECTED);
  }, [dccApiStatus, dccDeviceStatus, dccDevice]);

  return (<></>);
}

ApiEngine.defaultProps = {
  onReady: () => { log.info('API Ready'); }
}

export default ApiEngine;