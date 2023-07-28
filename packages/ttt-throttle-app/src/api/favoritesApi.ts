
const FAVORITES = '@ttt/throttle/favorites';

function get() {
  return localStorage?.getItem(FAVORITES) 
  ? JSON.parse(localStorage.getItem(FAVORITES) || '') : [];;
}

function add(newFav:any) {  
  const favorites = get();
  const newFavorites = [...favorites, newFav];
  localStorage.setItem(FAVORITES, JSON.stringify(newFavorites));
}

export const api = {
  get,
  add
}

export default api;
