import React, { useState, useEffect } from 'react';
import Chip from '@mui/material/Chip';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useConnectionStore } from '../Store/useConnectionStore';
import { useTurnoutStore } from '../Store/useTurnoutStore';
import useLayoutRoute from '../Routes/useLayoutRoute';
import TamStationSvg from './tamarack-junction-map.svg?react';
import TamIntSvg from './tamarack-junction-interchange.svg?react';
import BetatrackMapSvg from './betatrack-map.svg?react';

import './RouteMap.scss';

const RouteMap = props => {

  const [ selectedMap, setSelectedMap ] = useState('Tamarack Station');
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

  const mapConfig = {
    tam: [
      {
        map: 'Tamarack Station',
        el: (<TamStationSvg className={mapClassName} onClick={handleMapClick} />)
      },
      {
        map: 'Interchange',
        el: (<TamIntSvg className={mapClassName} onClick={handleMapClick} />)
      }
  
    ],
    betatrack: [
      {
        map: 'betatrack',
        el: (<BetatrackMapSvg className={mapClassName} onClick={handleMapClick} />)
      }
    ]
  }

  useEffect(() => {
    setSelectedMap(mapConfig[layoutId][0])
  }, [layoutId])

  function renderMapNav() {
    return mapConfig[layoutId] && mapConfig[layoutId].length > 1
      ? mapConfig[layoutId]?.map(m => {
        return (
          <Chip
            key={m.map}
            label={m.map}
            color="primary"
            sx={{ margin: '0 0.25rem' }}
            variant={m.map === selectedMap.map ? 'filled' : 'outlined'}
            onClick={() => setSelectedMap(m)}
          />
        )})
      : null
    
  }

  function renderMap() {
    return (
    <>
      {mapConfig[layoutId]?.map(el => el.el)}
    </>)
  }

  return (<>
    {renderMapNav()}
    {selectedMap.el}
  </>)
  
}

export default RouteMap;