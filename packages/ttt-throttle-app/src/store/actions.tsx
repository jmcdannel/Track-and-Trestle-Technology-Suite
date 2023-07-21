import { reactive } from 'vue';

let actions = reactive({
  turnouts: {}
});

export const reportTurnout = (payload: any) => {
  console.log('reportTurnout', payload);
  actions.turnouts = {...actions.turnouts, ...payload};
  console.log('reportTurnout', payload, actions.turnouts);
}

export const getActions = () => {
  return actions;
}

export default {
  actions,
  reportTurnout,
  getActions
};
