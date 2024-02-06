import React from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useConnectionStore } from '../Store/useConnectionStore';
import useLayoutRoute from '../Routes/useLayoutRoute';
import TamMapSvg from './tamarack-junction-map.svg?react';
import BetatrackMapSvg from './betatrack-map.svg?react';

import './RouteMap.scss';

const RouteMap = props => {

  const layoutId = useConnectionStore(state => state.layoutId);
  const {
    handleMapClick,
    computedRoutes
  } = useLayoutRoute();

  const mapClassName = computedRoutes()?.reduce((acc, rte) => {
    return `${acc} ${rte.disabled ? `disabled-${rte.svgId}` : ''}`;
  }, '' )

  function getMap() {
    switch (layoutId) {
      case 'tam':
        return <TamMapSvg onClick={handleMapClick} />
      case 'betatrack':
        return <BetatrackMapSvg className={mapClassName} onClick={handleMapClick} />
      default:
        return <div>Unknown layout</div>
    }
  }

  return <div>{getMap()}</div>
  
}

export default RouteMap;