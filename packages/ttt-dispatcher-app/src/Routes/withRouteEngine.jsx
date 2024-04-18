import React, { useState, useEffect, useCallback } from 'react';

import { useTurnout } from '../Turnouts/useTurnout';
import { useTurnoutStore } from '../Store/useTurnoutStore';
import { useRouteStore } from '../Store/useRouteStore';

const sleep = ms => new Promise(r => setTimeout(r, ms));
const TURNOUT_DELAY = 2000; // ms

export const withRouteEngine = WrappedComponent => props => {

  const [ routeOrigin, setRouteOrigin ] = useState(undefined);
  const [ routeDestination, setRouteDestination ] = useState(undefined);
  const [ autoRun, setAutoRun ] = useState(false);
  const { updateTurnout } = useTurnout();
  const turnouts = useTurnoutStore(state => state.turnouts);
  const routes = useRouteStore(state => state.routes);

  const setTurnouts = async deltas => {
    for(const delta of deltas){
      const t = turnouts.find(t => t.turnoutId === delta.turnoutId);
      console.log('[ROUTE ENGINE] setTurnouts', t.turnoutId, delta);
      updateTurnout({...t, state: delta.state});
      await sleep(TURNOUT_DELAY);
    }
  }

  const handleRouteToggle = async (rte, setRoute = true) => {
    console.log('handleRouteToggle', rte, setRoute);
    setAutoRun(setRoute);
    if (routeDestination && rte.routeId === routeDestination.routeId) {
      await setRouteDestination(undefined);
    } else if (routeOrigin && rte.routeId !== routeOrigin.routeId) { // origin is already selected, set this as the destination
      setRouteDestination(rte);
    } else if (!routeOrigin) {
      await setRouteOrigin(rte);
    } else if (routeOrigin && rte.routeId === routeOrigin.routeId) {
      await setRouteDestination(undefined);
      await setRouteOrigin(undefined);
    }
  }

  const handleSetRoute = useCallback(async () => {
    setAutoRun(false);
    const path = routes.paths.find(path => path.destinations.includes(routeOrigin.routeId) && path.destinations.includes(routeDestination.routeId))
    await setTurnouts(path.turnouts);
    setTimeout(() => {
      setRouteDestination(undefined);
      setRouteOrigin(undefined);
    }, 3000);
  }, [routeDestination, routeOrigin, routes?.paths, setTurnouts]);

  const handleClearRoute = () => {
    setRouteDestination(undefined);
    setRouteOrigin(undefined);
  }

  useEffect(() => {
    if (autoRun && !!routeDestination) {
      handleSetRoute();
    }
  }, [routeDestination, autoRun, handleSetRoute]);

  const isRouteConnected = (originId, destinationId) => {
    return !!routes.paths.find(path => path.destinations.includes(originId) && path.destinations.includes(destinationId));
  }

  const computedRoutes = () => {
    const computedRouteProps = rte => {
      const classNames = ['route'];
      let disabled = false;
      let variant = 'outlined';
      let isOrigin = false;
      let isDestination = false;
      if (routeDestination && routeDestination.routeId === rte.routeId) {
          classNames.push('route__destination');
          variant = 'contained';
          isDestination = true;
      } else if (routeOrigin && routeOrigin.routeId === rte.routeId) {
          classNames.push('route__origin');
          variant = 'contained';
          isOrigin = true;
      } else if (!routeDestination && routeOrigin) {
        if (isRouteConnected(routeOrigin.routeId, rte.routeId)) {
          classNames.push('route__available-option');
        } else {
          classNames.push('route__unavailable-option');
          disabled = true;
        }
      } else if (routeDestination && routeOrigin) {
        classNames.push('route__unavailable-option');
        disabled = true;
      }
      return {
        className: classNames.join(' '),
        disabled,
        variant,
        isOrigin,
        isDestination
      };
    }
    return routes?.destinations.map(rte => ({
      ...rte,
      ...computedRouteProps(rte)
    })) || [];
  }

  return (
    <WrappedComponent 
      handleSetRoute={handleSetRoute}
      handleRouteToggle={handleRouteToggle} 
      handleClearRoute={handleClearRoute}
      computedRoutes={computedRoutes()}
      routeOrigin={routeOrigin}
      routeDestination={routeDestination}
      { ...props } 
    />
  );
};

export default withRouteEngine;