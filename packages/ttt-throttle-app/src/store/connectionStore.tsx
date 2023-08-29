import {  reactive } from 'vue';
import { defineStore } from 'pinia';

export const useConnectionStore = defineStore('connections', {
  state: () => ({
    connections: reactive([])
  }),
  getters: {
    getConnection: (state) => (id:string) => state.connections.find(c => c.connectionId === id),
  },
  actions: {
    setConnection(connectionId, connection) {
      // Check if the object already exists in the array
      const index = this.connections.findIndex(element => element.connectionId === connectionId);
      // If the object exists, update it
      if (index > -1) {
        this.connections[index] = {...this.connections[index], ...connection };
      } else {
        // Otherwise, add it to the array
        this.connections.push({ connectionId, ...connection });
      }
      console.log('setConnection.connections', this.connections);
    }
  }
});
