import { useLayoutStore } from '../../Store/useLayoutStore'

export function useLayoutLines(_id) {

  const layout = useLayoutStore(state => state.layout)

  function getLineById(id) {
    return layout?.meta?.lines.find(line => line.id === id)
  }

  const line = getLineById(_id)

  return [ line ]

}

export default useLayoutLines
