import React, { useContext, useEffect, useState } from 'react';
import api from '../Api';
import { Context } from '../Store/Store';
import log from '../Shared/utils/logger';

function ApiEngine(props) {

  const { onReady } = props;
  const [ state, dispatch ] = useContext(Context);
  const [ init, setInit ] = useState(false);
  const { layout } = state;

  console.log('state', state, layout);

  useEffect(() => {
    layout && onReady();
  }, [layout, onReady]);

  useEffect(() => {
    const initialize = async function() {
      try {
        setInit(true);
        const apiSuccess = await api.initialize(dispatch);
        const wsSuccess = await api.initializeWS();
      } catch (err) {
        setInit(false);
        log.error('api initialization error', err);
      }
    };
    
    !init && initialize();
  }, [onReady, init, dispatch]);


  return (<></>);
}

ApiEngine.defaultProps = {
  onReady: () => { log.info('API Ready'); }
}

export default ApiEngine;