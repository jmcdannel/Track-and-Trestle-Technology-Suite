export const initialState = {
  layout: null,
  userPreferences: {
    turnoutView: window.localStorage.getItem('turnoutView') || 'tiny',
    dispatcherLayout: JSON.parse(window.localStorage.getItem('dispatcherLayout')) || { map: true, routes: true, turnouts: true }
  }
};

export default initialState;
