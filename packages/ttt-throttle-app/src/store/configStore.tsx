import { defineStore } from 'pinia';
import api from '../api/api.js';

//await api.favorites.get()

export const useConfigStore = defineStore('config', {
  state: () => ({
    connections: [],
    layoutApi: {},
    dccApi: {},
    layoutId: api.config.layoutId.get(),
    favorites: []
  }),
  actions: {
    getConnection(connectionId) {
      console.log('getConnection', this.connections, connectionId);
      return this.connections.length && this.connections.find
        ? this.connections.find({ connectionId })
        : null;
    },
    setConnection(connectionId, connection) {
      this.connections.push({ connectionId, ...connection });
      console.log('setConnection', this.connections)
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
    }
  }
})