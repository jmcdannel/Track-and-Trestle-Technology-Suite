import { useContext } from 'react'
import BnsfLogoSvg from '../images/logos/bnsf.svg?react';
import UpLogoSvg from '../images/logos/up.svg?react';
import SfLogoSvg from '../images/logos/sf.svg?react';
import { Context } from '../../Store/Store'

const MRLLogoPng = '/images/logos/mrl.png';

export function useLayoutRoadnames(_id) {

  const [ state ] = useContext(Context)
  const { meta: { roadnames: layoutRoadnames } } = state.layout

  function getRoadnameById(id) {
    return layoutRoadnames.find(rd => rd.id === id)
  }
  function getLogo(roadname, defaultLogo = null) {
    switch (roadname) {
      case 'bnsf':
        return <BnsfLogoSvg  />
      case 'up':
        return <UpLogoSvg  />
      case 'sf':
        return <SfLogoSvg  />
      case 'mr':
        return <img src={MRLLogoPng} />
      default:
        return defaultLogo
    }
  }
    

  const roadname = getRoadnameById(_id)
  const roadlogo = getLogo(_id)

  return [ roadname, roadlogo ]

}

export default useLayoutRoadnames
