import React, { useState } from 'react';

import Snackbar from '@mui/material/Snackbar';

import { useTurnoutStore } from '../Store/useTurnoutStore';
import { useRouteStore } from '../Store/useRouteStore';

export const withMapEngine = WrappedComponent => props => {

  const { computedRoutes, handleRouteToggle, handleTurnoutChange } = props;

  const [ error, setError] = useState(false);
  const turnouts = useTurnoutStore(state => state.turnouts);
  const routes = useRouteStore(state => state.routes);
  const dispatcherLayout = state.userPreferences.dispatcherLayout;

  const handleMapClick = async (e) => {
    const svgBtn = findClickableParent(e.target);    
    console.log('[withMapEngine] handleMapClick', svgBtn);
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

  const handleMapRouteClick = svgId => {
    const rte = routes.destinations.find(r => r.svgId === svgId);
    console.log('[withMapEngine] handleMapRouteClick', svgId, rte);
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
    const turnout = turnouts.find(t => t.turnoutId === getTurnoutId(svgId));
    turnout && handleTurnoutChange({
      turnoutId: turnout.turnoutId,
      state: !turnout.state
    });

  }

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

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(undefined);
  };
 
  const getClassNames = () => {
    const turnoutClassNames = turnouts.map(t => `turnout-${t.turnoutId}-${t.state ? 'straight' : 'divergent'}`);
    const routeClassNames = computedRoutes?.map(rte => {
      if (rte.isOrigin) {
        return `route-${rte.svgId}-origin`;
      } else if (rte.isDestination) {
        return `route-${rte.svgId}-destination`;
      } else if (rte.disabled) {
        return `route-${rte.svgId}-unavailable`;
      } else {
        return `route-${rte.svgId}-available`;
      }
    });
    // console.log('svgIds', computedRoutes.map(rte => rte.svgId));
    const classNames = [...turnoutClassNames, ...routeClassNames];
    if (!dispatcherLayout.routes) {
      classNames.push('hide-routes');
    }
    if (!dispatcherLayout.turnouts) {
      classNames.push('hide-turnouts');
    }
    return classNames.join(' ');
  };

  return (
    <div className={getClassNames()}>
      <WrappedComponent 
        handleMapClick={handleMapClick}
        { ...props } 
      />
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose} message={error} />
    </div>
  );
}

export default withMapEngine;