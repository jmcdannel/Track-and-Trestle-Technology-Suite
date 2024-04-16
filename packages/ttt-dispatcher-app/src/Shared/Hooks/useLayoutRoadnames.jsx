import { useContext } from 'react'
import BnsfLogoSvg from '../Images/logos/bnsf.svg?react';
import UpLogoSvg from '../Images/logos/up.svg?react';
import SfLogoSvg from '../Images/logos/sf.svg?react';
import MrlLogoSvg from '../Images/logos/mrl.svg?react';
import { useLayoutStore } from '../../Store/useLayoutStore'

const MRLLogoPng = '/images/logos/mrl.png';

export function useLayoutRoadnames(_id) {
  const layout = useLayoutStore(state => state.layout)

  function getRoadnameById(id) {
    return layout?.meta?.roadnames.find(rd => rd.id === id)?.abbr || 'NA'
  }
  function getLogo(roadname, defaultLogo = null) {
    switch (roadname) {
      case 'bnsf':
        return <BnsfLogoSvg />
      case 'up':
        return <UpLogoSvg  />
      case 'sf':
        return <SfLogoSvg  />
      case 'mrl':
        return <MrlLogoSvg />
      case 'gn':
        return <img src="/images/logos/Great_Northern_Herald.png" alt="Great Northern" />
      default:
        return defaultLogo
    }
  }
    

  const roadname = getRoadnameById(_id)
  const roadlogo = getLogo(_id)

  return [ roadname, roadlogo ]

}

export default useLayoutRoadnames
