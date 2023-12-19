import { useContext } from 'react'
import { Context } from '../../Store/Store'

export function useLayoutLines(_id) {

  const [ state ] = useContext(Context)
  const { meta: { lines: layoutLines } } = state.layout

  function getLineById(id) {
    return layoutLines.find(line => line.id === id)
  }

  const line = getLineById(_id)

  return [ line ]

}

export default useLayoutLines
