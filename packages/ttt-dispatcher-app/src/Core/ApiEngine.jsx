import React, { useContext, useEffect, useState } from 'react';
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

  const dccDevice = useConnectionStore(state => state.dccDevice);
  const setDccDevice = useConnectionStore(state => state.setDccDevice);

  const dccApiStatus = useConnectionStore(state => state.dccApiStatus);
  const dccDeviceStatus = useConnectionStore(state => state.dccDeviceStatus);
  const actionApiStatus = useConnectionStore(state => state.actionApiStatus);
  const actionDevices = useConnectionStore(state => state.actionDevices);
  const addActionDevice = useConnectionStore(state => state.addActionDevice);
  const updateActionDeviceStatusByPort = useConnectionStore(state => state.updateActionDeviceStatusByPort);
  

  const setActionApiStatus = useConnectionStore(state => state.setActionApiStatus);
  const setDccApiStatus = useConnectionStore(state => state.setDccApiStatus);
  const setDccDeviceStatus = useConnectionStore(state => state.setDccDeviceStatus);

  const setDccPorts = useConnectionStore(state => state.setDccPorts);
  const setActionPorts = useConnectionStore(state => state.setActionPorts);

  const handleDccMessage = (message) => {
    try {
      const { action, payload } = JSON.parse(message.data);
      console.log('[ApiEngine] handleDccMessage', action, payload, message);
      switch (action) {
        case 'listPorts':
          setDccPorts(payload);
          break;
        case 'socketConnected':
          setDccApiStatus(CONNECTION_STATUS.CONNECTED);
          break;
        case 'connected':
          setDccDeviceStatus(CONNECTION_STATUS.CONNECTED);
          setDccDevice(payload.path);
          break;
        case 'broadcast':
          // no-op
          break;
      }
    } catch (err) { 
      setDccApiStatus(CONNECTION_STATUS.DISCONNECTED);
      setDccDeviceStatus(CONNECTION_STATUS.DISCONNECTED);
      console.error('[ApiEngine] handleDccMessage error', err); 
    }
  }

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
          // setDccDeviceStatus(CONNECTION_STATUS.CONNECTED);
          // setDccDevice(payload.path);
          break;
        case 'broadcast':
          // no-op
          break;
      }
    } catch (err) { 
      setActionApiStatus(CONNECTION_STATUS.DISCONNECTED);
      // setDccDeviceStatus(CONNECTION_STATUS.DISCONNECTED);
      console.error('[ApiEngine] handleActionMessage error', err); 
    }
  }

  // Connect Host
  useEffect(() => {
    const initialize = async function() {
      try {
        setStatus(CONNECTION_STATUS.CONNECTING);
        const result = await api.connect(dispatch, host, layoutId);
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

  // Connect Host Interfaces
  useEffect(() => {
    console.log('[ApiEngine] layout', layout);

    if (layout?.interfaces?.find(i => i.type === 'dcc-js-api')) {
      setDccApiStatus(CONNECTION_STATUS.CONNECTING);
      api.dcc.connect(host, handleDccMessage);
    }

    if (layout?.interfaces?.find(i => i.type === 'action-api')) {
      setActionApiStatus(CONNECTION_STATUS.CONNECTING);
      api.actionApi.connect(host, handleActionMessage);
    }


  }, [layout]);

  // Connect DCC Device
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

  return (<></>);
}

ApiEngine.defaultProps = {
  onReady: () => { log.info('API Ready'); }
}

export default ApiEngine;