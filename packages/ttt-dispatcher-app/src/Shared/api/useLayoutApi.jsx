import axios from 'axios';
import { useConnectionStore } from '../../Store/useConnectionStore';

export function useLayoutApi() {
  
  const layoutId = useConnectionStore(state => state.layoutId);

  async function get(type, Id = null) {
    try {
      const host = import.meta.env.VITE_LAYOUT_API_HOST;
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
