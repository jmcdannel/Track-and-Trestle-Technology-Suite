import { useState, useEffect, useCallback } from 'react';
import { useTurnout } from '../Turnouts/useTurnout';
import { useTurnoutStore } from '../Store/useTurnoutStore';
import { useRouteStore } from '../Store/useRouteStore';

const sleep = ms => new Promise(r => setTimeout(r, ms));
const TURNOUT_DELAY = 2000; // ms

export function useLayoutRoute() {

const isRouteConnected = (originId, destinationId) => {
  return !!routes.paths.find(path => path.destinations.includes(originId) && path.destinations.includes(destinationId));
}

const computedRouteProps = rte => {
  const classNames = ['route'];
  let disabled = false;
  let variant = 'outlined';
  let isOrigin = false;
  let isDestination = false;
  if (routeDestination && routeDestination === rte.routeId) {
      classNames.push('route__destination');
      variant = 'contained';
      isDestination = true;
  } else if (routeOrigin && routeOrigin === rte.routeId) {
      classNames.push('route__origin');
      variant = 'contained';
      isOrigin = true;
  } else if (!routeDestination && routeOrigin) {
    if (isRouteConnected(routeOrigin, rte.routeId)) {
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

  const { updateTurnout } = useTurnout();
  const turnouts = useTurnoutStore(state => state.turnouts);
  const routes = useRouteStore(state => state.routes);
  const routeOrigin = useRouteStore(state => state.routeOrigin);
  const routeDestination = useRouteStore(state => state.routeDestination);
  const updateOrigin = useRouteStore(state => state.updateOrigin);
  const updateDestination = useRouteStore(state => state.updateDestination);
 
  const computedRoutes = routes?.destinations?.map(rte => ({
    ...rte,
    ...computedRouteProps(rte)
  })) || [];
  
  const setTurnouts = async deltas => {
    for(const delta of deltas){
      const t = turnouts.find(t => t.turnoutId === delta.turnoutId);
      console.log('[useLayoutRoute] setTurnouts', t.turnoutId, delta);
      updateTurnout({...t, state: delta.state});
      await sleep(TURNOUT_DELAY);
    }
  }

  const handleSetRoute = useCallback(async () => {
    console.log('[useLayoutRoute] handleSetRoute', routeOrigin, routeDestination, routes?.paths);
    const path = routes.paths.find(path => path.destinations.includes(routeOrigin) && path.destinations.includes(routeDestination))
    await setTurnouts(path.turnouts);
    setTimeout(() => {
      updateDestination(undefined);
      updateOrigin(undefined);
    }, 3000);
  }, [routeDestination, routeOrigin, routes?.paths, setTurnouts]);

  const handleRouteToggle = ({ routeId }) => {
    console.log('[useLayoutRoute] handleRouteToggle', routeId);
    if (routeDestination && routeId === routeDestination) { // a destination exists and rte is the same as the current destination. in this case, clear the selected destination
      updateDestination(undefined);
    } else if (routeOrigin && routeId !== routeOrigin) { // origin exists and rte is not the same as the current origin. in this case, set the destination
      updateDestination(routeId);
    } else if (!routeOrigin) { // no origin exists, set the origin
      updateOrigin(routeId);
    } else if (routeOrigin && routeId === routeOrigin) { // origin exists and rte is the same as the current origin. in this case, clear the selected origin and destination (reset)
      updateDestination(undefined);
      updateOrigin(undefined);
    }
  }

  const handleMapTurnoutClick = async svgId => {
    const getTurnoutId = svgId => {
      if (svgId.startsWith('lbl')) {
        return parseInt(svgId.replace(/lbl/g, ''));
      } else if (svgId.startsWith('_')) {
        return parseInt(svgId.replace(/_/g, ''));
      }
    }
    const t = turnouts.find(t => t.turnoutId === getTurnoutId(svgId));
    updateTurnout({...t, state: !t.state});
  }

  useEffect(() => {
    if (!!routeDestination) {
      handleSetRoute();
    }
  }, [routeDestination]);

  return {
    handleRouteToggle,
    handleMapTurnoutClick,
    computedRoutes
  }

}

export default useLayoutRoute
  