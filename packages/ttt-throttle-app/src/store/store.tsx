import { reactive } from 'vue';
import api from '../api/api.ts';

export const store = reactive({
  // connections: 
  conections: {},
  layoutId: await api.config.getLayoutId(),
  favorites: await api.favorites.get(),
});

export default store;
