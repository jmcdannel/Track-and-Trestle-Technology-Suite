import { defineStore } from 'pinia';
import api from '../api/api.js';

//await api.favorites.get()

export const useConfigStore = defineStore('config', {
  state: () => ({
    connections: [],
    layoutApi: {
      connected: false,
    },
    dccApi: {
      api: null,
      connected: false,
    },
    layoutId: api.config.layoutId.get(),
    locoId: api.config.loco.get(),
    favorites: []
  }),
  getters: {
    getConnection: (state) => {
      console.log('getConnection', state.connections);
      return (connectionId:string) => state.connections.find(c => { 
        console.log('find connection', state.connections.length, c.connectionId, connectionId);
        return c.connectionId === connectionId 
      });
    },
  },
  actions: {
    setConnection(connectionId, connection) {
      let conn = this.connections.find(c => { c.connectionId === connectionId });
      console.log('setConnection', conn, connectionId, connection);
      if (conn) {
        conn = {...conn, ...connection };
      } else {  
        this.connections.push({ connectionId, ...connection });
      }
      console.log('setConnection', this.connections);
    },
    setLayoutApi(connection) {
      this.layoutApi = {...this.layoutApi, ...connection };
      console.log('setLayoutApi', this.layoutApi)
    },
    setDCCApi(connection) {
      this.dccApi = {...this.dccApi, ...connection };
      console.log('setDCCApi', this.dccApi)
    },
    setLayoutId(layoutId) {
      this.layoutId = layoutId;
    },
    setLocoId(locoId) {
      this.locoId = locoId;
    }
  }
})