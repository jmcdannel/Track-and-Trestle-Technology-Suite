import React from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useConnectionStore } from '../Store/useConnectionStore';
import useLayoutRoute from '../Routes/useLayoutRoute';
import TamMapSvg from './tamarack-junction-map.svg?react';
import BetatrackMapSvg from './betatrack-map.svg?react';

const RouteMap = props => {

  const layoutId = useConnectionStore(state => state.layoutId);
  const {
    handleMapClick
  } = useLayoutRoute();

  function getMap() {
    switch (layoutId) {
      case 'tam':
        return <TamMapSvg onClick={handleMapClick} />
      case 'betatrack':
        return <BetatrackMapSvg onClick={handleMapClick} />
      default:
        return <div>Unknown layout</div>
    }
  }

  return <div>{getMap()}</div>
  
}

export default RouteMap;