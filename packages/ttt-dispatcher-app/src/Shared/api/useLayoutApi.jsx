import { useEffect } from 'react';
import axios from 'axios';
import log from '../utils/logger';
import { useConnectionStore, CONNECTION_STATUS } from '../../Store/useConnectionStore';

export function useLayoutApi() {
  
  const host = useConnectionStore(state => state.host);
  const layoutId = useConnectionStore(state => state.layoutId);

  async function get(type, Id = null) {
    try {
      const path = Id !== null
          ? `/${layoutId}/${type}/${Id}`
          : `/${layoutId}/${type}`;
      // console.log('[layoutApi] get', uri);
      const response = await axios.get(`http://${host}:5200/api${path}`);
      
      return Id 
        ? response.data 
        : response.data?.[0]?.[type]
          ? response.data?.[0]?.[type]
          : response.data?.[0];
    } catch (err) {
      console.error(err);
      throw new Error(`Unable to read ${type}, Id=${Id}`);
    }
  }

  return {
    getByType: async (type, Id) => await get(type, Id)
  }

}

export default useLayoutApi
