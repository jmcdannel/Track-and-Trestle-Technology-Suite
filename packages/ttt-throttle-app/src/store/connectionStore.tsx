import { defineStore } from 'pinia';

export const useConnectionStore = defineStore('connection', {
  state: () => ({
    connectionId: null,
    connected: false,
    config: {}
  }),
  actions: {
    connect() {
      this.connected = true;
    }
  }
});
