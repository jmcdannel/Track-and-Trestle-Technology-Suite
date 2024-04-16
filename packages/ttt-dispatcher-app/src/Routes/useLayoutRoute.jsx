import { useState, useEffect, useCallback } from 'react';
import { useTurnout } from '../Turnouts/useTurnout';
import { useTurnoutStore } from '../Store/useTurnoutStore';
import { useRouteStore } from '../Store/useRouteStore';


const sleep = ms => new Promise(r => setTimeout(r, ms));
const TURNOUT_DELAY = 2000; // ms

export function useLayoutRoute() {

  const [ routeOrigin, setRouteOrigin ] = useState(undefined);
  const [ routeDestination, setRouteDestination ] = useState(undefined);
  const { updateTurnout } = useTurnout();
  const turnouts = useTurnoutStore(state => state.turnouts);
  const routes = useRouteStore(state => state.routes);

  const findClickableParent = target => {
    const clickableContainers = ['Routes', 'Turnouts', 'TurnoutLabels']; 
    let found = false;
    let currentTarget = target;
    let targetType = '';
    while(!found && currentTarget && currentTarget.parentNode) {
      if (currentTarget.parentNode.nodeName.toLowerCase() === 'svg') {
        currentTarget = null;
      } else if (clickableContainers.includes(currentTarget.parentNode.id)) {
        targetType = currentTarget.parentNode.id;
        found = true;
      } else {
        currentTarget = currentTarget.parentNode;
      }
    }
    return found ? { target: currentTarget, type: targetType } : null;
  }

  const setTurnouts = async deltas => {
    for(const delta of deltas){
      const t = turnouts.find(t => t.turnoutId === delta.turnoutId);
      console.log('[useLayoutRoute] setTurnouts', t.turnoutId, delta);
      updateTurnout({...t, state: delta.state});
      await sleep(TURNOUT_DELAY);
    }
  }

  const handleSetRoute = useCallback(async () => {
    const path = routes.paths.find(path => path.destinations.includes(routeOrigin.routeId) && path.destinations.includes(routeDestination.routeId))
    await setTurnouts(path.turnouts);
    setTimeout(() => {
      setRouteDestination(undefined);
      setRouteOrigin(undefined);
    }, 3000);
  }, [routeDestination, routeOrigin, routes?.paths, setTurnouts]);

  const handleMapClick = async (e) => {
    const svgBtn = findClickableParent(e.target);    
    console.log('[useLayoutRoute] handleMapClick', svgBtn);
    if (svgBtn) {
      switch(svgBtn.type) {
        case 'Routes':
          handleMapRouteClick(svgBtn.target.id);
          break;
        case 'Turnouts':
        case 'TurnoutLabels':
          handleMapTurnoutClick(svgBtn.target.id);
          break;
        default:
          // noop
          break;
      }
    }
  }

  const handleRouteToggle = async (rte) => {
    console.log('[useLayoutRoute] handleRouteToggle', rte);
    if (routeDestination && rte.routeId === routeDestination.routeId) { // a destination exists and rte is the same as the current destination. in this case, clear the selected destination
      await setRouteDestination(undefined);
    } else if (routeOrigin && rte.routeId !== routeOrigin.routeId) { // origin exists and rte is not the same as the current origin. in this case, set the destination
      setRouteDestination(rte);
    } else if (!routeOrigin) { // no origin exists, set the origin
      await setRouteOrigin(rte);
    } else if (routeOrigin && rte.routeId === routeOrigin.routeId) { // origin exists and rte is the same as the current origin. in this case, clear the selected origin and destination (reset)
      await setRouteDestination(undefined);
      await setRouteOrigin(undefined);
    }
  }

  const handleMapRouteClick = svgId => {
    const rte = routes.destinations.find(r => r.svgId === svgId);
    console.log('[useLayoutRoute] handleMapRouteClick', svgId, rte);
    handleRouteToggle(rte, true);

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

  const isRouteConnected = (originId, destinationId) => {
    return !!routes.paths.find(path => path.destinations.includes(originId) && path.destinations.includes(destinationId));
  }

  const computedRoutes = () => {
    // console.log('[useLayoutRoute] computedRoutes', routes);
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

  useEffect(() => {
    if (!!routeDestination) {
      handleSetRoute();
    }
  }, [routeDestination]);

  return {
    computedRoutes,
    handleRouteToggle,
    handleMapRouteClick,
    handleMapTurnoutClick,
    handleMapClick,
    routeOrigin, 
    routeDestination
  }

}

export default useLayoutRoute
  