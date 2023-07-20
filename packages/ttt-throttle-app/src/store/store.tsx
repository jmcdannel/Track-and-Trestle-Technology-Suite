import { reactive } from 'vue';
import api from '../api/api.ts';

export const store = reactive({
  layoutId: api.getLayoutId()
});

export default store;
