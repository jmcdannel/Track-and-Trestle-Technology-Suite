import { useContext } from 'react'
import { Context } from '../../Store/Store'

export function useLayoutLines(_id) {

  const [ state ] = useContext(Context)
  const { layout } = state

  function getLineById(id) {
    return layout?.meta?.lines.find(line => line.id === id)
  }

  const line = getLineById(_id)

  return [ line ]

}

export default useLayoutLines
