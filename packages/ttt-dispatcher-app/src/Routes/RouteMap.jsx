import React, { useState, useEffect, useCallback } from 'react';
import Chip from '@mui/material/Chip';
import { useConnectionStore } from '../Store/useConnectionStore';
import { useRouteStore } from '../Store/useRouteStore';
import useLayoutRoute from '../Routes/useLayoutRoute';
import TamIntSvg from './tamarack-junction-interchange.svg?react';
import TamStationSvg from './tamarack-junction-map.svg?react';
import BetatrackMapSvg from './betatrack-map.svg?react';

import './RouteMap.scss';

const mapConfig = {
  tam: ['Tamarack Station', 'Interchange'],
  betatrack: ['betatrack']
}

const RouteMap = ({ onRouteToggle, onTurnoutToggle, routes, turnouts, routeOrigin, routeDestination }) => {

  const layoutId = useConnectionStore(state => state.layoutId);
  const [selectedMap, setSelectedMap] = useState(mapConfig[layoutId][0]);

  const routeClasses = routes?.reduce((acc, rte) => {
    return `${acc} ${rte.disabled ? `disabled-${rte.svgId}` : ''}`;
  }, '');
  const turnoutClasses = turnouts.map(t => {
    return t.state
      ? `turnout-${t.turnoutId}-straight`
      : `turnout-${t.turnoutId}-divergent`
  }).join(' ');
  const mapClassName = `${routeClasses} ${turnoutClasses}`

  const findClickableParent = target => {
    const clickableContainers = ['Routes', 'Turnouts', 'TurnoutLabels'];
    let found = false;
    let currentTarget = target;
    let targetType = '';
    while (!found && currentTarget && currentTarget.parentNode) {
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

  const handleMapClick = async (e) => {
    e.preventDefault();
    const svgBtn = findClickableParent(e.target);
    if (svgBtn) {
      switch (svgBtn.type) {
        case 'Routes':
          const rte = routes.find(r => r.svgId === svgBtn.target.id);
          console.log('handleMapRouteClick', svgBtn.target.id, routeOrigin, routeDestination);
          await onRouteToggle(rte);
          break;
        case 'Turnouts':
        case 'TurnoutLabels':
          await onTurnoutToggle(svgBtn.target.id);
          break;
        default:
          // noop
          break;
      }
    }
  };

  function renderMapNav() {
    return mapConfig[layoutId] && mapConfig[layoutId].length > 1
      ? mapConfig[layoutId]?.map(m => {
        return (
          <Chip
            key={m}
            label={m}
            color="primary"
            sx={{ margin: '0 0.25rem' }}
            variant={m === selectedMap ? 'filled' : 'outlined'}
            onClick={() => setSelectedMap(m)}
          />
        )
      })
      : null
  }

  function renderMap() {
    switch (selectedMap) {
      case 'Tamarack Station':
        return <TamStationSvg className={mapClassName} onClick={handleMapClick} />
      case 'Interchange':
        return <TamIntSvg className={mapClassName} onClick={handleMapClick} />
      case 'betatrack':
        return <BetatrackMapSvg className={mapClassName} onClick={handleMapClick} />
    }
  }

  return (<>
    {renderMapNav()}
    {renderMap()}
  </>)

}

export default RouteMap;