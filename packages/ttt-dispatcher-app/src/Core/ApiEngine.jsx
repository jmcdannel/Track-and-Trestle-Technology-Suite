import React, { useContext, useEffect, useState } from 'react';
// import api from '../Api';
import api from '../Shared/api/api';
import { Context } from '../Store/Store';
import log from '../Shared/utils/logger';
import useConnectionStore from '../Store/useConnectionStore';

function ApiEngine(props) {

  const { onReady } = props;
  const [ state, dispatch ] = useContext(Context);
  const [ init, setInit ] = useState(false);
  const [ init2, setInit2 ] = useState(false);
  const { layout } = state;
  const host = useConnectionStore(state => state.host);

  useEffect(() => {
    layout && onReady();
  }, [layout, onReady]);

  // useEffect(() => {
  //   const initialize = async function() {
  //     try {
  //       console.log('[ApiEngine] connect');
  //       await api.connect();
  //     } catch (err) {
  //       log.error('api initialization error', err);
  //     }
  //   };
    
  //   initialize();
  // }, [host]);

  useEffect(() => {
    const initialize = async function() {
      try {
        if (init2) return;
        console.log('[ApiEngine] connect2');
        await api.connect(dispatch);
        setInit2(true);
        // const apiSuccess = await api.initialize(dispatch);
        // const wsSuccess = await api.initializeWS();
      } catch (err) {
        setInit2(true);
        log.error('api initialization error2', err);
      }
    };
    
    !init && initialize();
  }, [onReady, init2, dispatch]);


  return (<></>);
}

ApiEngine.defaultProps = {
  onReady: () => { log.info('API Ready'); }
}

export default ApiEngine;