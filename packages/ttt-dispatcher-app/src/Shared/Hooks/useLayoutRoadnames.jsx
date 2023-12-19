import { useContext } from 'react'
import { Context } from '../../Store/Store'

export function useLayoutRoadnames(_id) {

  const [ state ] = useContext(Context)
  const { meta: { roadnames: layoutRoadnames } } = state.layout

  function getRoadnameById(id) {
    return layoutRoadnames.find(rd => rd.id === id)
  }

  const roadname = getRoadnameById(_id)

  return [ roadname ]

}

export default useLayoutRoadnames
