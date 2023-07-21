import { reactive } from 'vue';
import api from '../api/api.ts';

export const store = reactive({
  layoutId: api.getLayoutId(),
  favorites: api.favorites.get(),
});

export default store;
