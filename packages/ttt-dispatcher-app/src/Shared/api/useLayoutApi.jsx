import { useEffect } from 'react';
import axios from 'axios';
import log from '../utils/logger';
import { useConnectionStore, CONNECTION_STATUS } from '../../Store/useConnectionStore';

export function useLayoutApi() {
  
  // const host = useConnectionStore(state => state.host);
  const layoutId = useConnectionStore(state => state.layoutId);

  async function get(type, Id = null) {
    try {
      // const host = 'https://ttt-app-git-dev-jmcdannels-projects.vercel.app'
      // const host = 'https://trestle-tt-suite-ttt-app.vercel.app'
      // const host = 'http://127.0.0.1:5001'
      const host = import.meta.env.VITE_LAYOUT_API_HOST;
      // const host = 'https://ttt-7mzhiuxob-jmcdannels-projects.vercel.app'
      const path = Id !== null
          ? `/${type}/${layoutId}/${Id}`
          : `/${type}/${layoutId}`;
      const qs = '';//'?_vercel_share=B64pZzYba7TVUidqjsmnfJBDZT0YpLei'
      const response = await axios.get(`${host}/api${path}${qs}`);
      console.log('[layoutApi] get', host, path, response.data?.[0]?.[type]);
      
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
