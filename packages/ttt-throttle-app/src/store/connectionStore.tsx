import {  reactive } from 'vue';
import { defineStore } from 'pinia';

export const useConnectionStore = defineStore('connections', {
  state: () => ({
    ids: [],
    connections: new Map()
  }),
  getters: {
    getConnection: (state) => (id:string) => reactive(state.connections.get(id)),
  },
  actions: {
    setConnection(connectionId, connection) {
      // Check if the object already exists in the array
      console.log('[connectionStore.setConnection]', connectionId, connection);
      const conn = this.connections.get(connectionId);
      this.connections.set(connectionId, {...conn, ...connection });
      console.log('setConnection.connections', this.connections, connectionId, connection);
    }
  }
});
