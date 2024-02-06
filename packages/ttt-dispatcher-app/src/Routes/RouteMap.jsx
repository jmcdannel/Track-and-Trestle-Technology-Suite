import React from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useConnectionStore } from '../Store/useConnectionStore';
import { useTurnoutStore } from '../Store/useTurnoutStore';
import useLayoutRoute from '../Routes/useLayoutRoute';
import TamMapSvg from './tamarack-junction-map.svg?react';
import BetatrackMapSvg from './betatrack-map.svg?react';

import './RouteMap.scss';

const RouteMap = props => {

  const layoutId = useConnectionStore(state => state.layoutId);
  const turnouts = useTurnoutStore(state => state.turnouts);
  const {
    handleMapClick,
    computedRoutes
  } = useLayoutRoute();

  const routeClasses = computedRoutes()?.reduce((acc, rte) => {
    return `${acc} ${rte.disabled ? `disabled-${rte.svgId}` : ''}`;
  }, '' )
  const turnoutClasses = turnouts.map(t => {
    // return t.turnoutId
    return t.state
      ? `turnout-${t.turnoutId}-straight`
      : `turnout-${t.turnoutId}-divergent`
  }).join(' ')
    
  const mapClassName = `${routeClasses} ${turnoutClasses}`

  console.log('[RouteMap] mapClassName', mapClassName)

  function getMap() {
    switch (layoutId) {
      case 'tam':
        return <TamMapSvg className={mapClassName} onClick={handleMapClick} />
      case 'betatrack':
        return <BetatrackMapSvg className={mapClassName} onClick={handleMapClick} />
      default:
        return <div>Unknown layout</div>
    }
  }

  return <div>{getMap()}</div>
  
}

export default RouteMap;