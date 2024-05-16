import React, { useContext } from 'react';
import { Route, Routes } from "react-router-dom";
import Conductor from '../Conductor/Conductor';
import Pinout from '../Settings/Pinout'; // TODO: refactor
import Settings from '../Core/Settings';
import { Dashboard as DccDashboard } from '../Dcc/Dashboard';
import Dispatcher from '../Dispatcher/Dispatcher';
import Effects from '../Effects/Effects';
import { useEffectStore } from '../Store/useEffectStore';
import { useLocoStore } from '../Store/useLocoStore';
import { useLayoutStore } from '../Store/useLayoutStore';
import { useRouteStore } from '../Store/useRouteStore';
import { useTurnoutStore } from '../Store/useTurnoutStore';

function Modules(props) {

  const locos = useLocoStore(state => state.locos);
  const turnouts = useTurnoutStore(state => state.turnouts);
  const routes = useRouteStore(state => state.routes);
  const effects = useEffectStore(state => state.effects);
  const layout = useLayoutStore(state => state.layout);
  const loading = (<div>Loading</div>);

  const getRoutedModule = module => {
    switch(module) {
      case 'turnouts' :
        return (
          <Route path="/dispatcher" key={module} element={
            (routes || turnouts) && <Dispatcher />
          } />
        );
      case 'effects' :
        return (
          <Route path="/effects" key={module} element={
            effects && <Effects />
          } />
        )
      default:
        return null;
    }
  }

  return (
    <Routes>
      <Route path="/" exact element={locos ? <Conductor /> : loading} />
      <Route path="/pinout" exact element={<Pinout />} />
      <Route path="/settings" exact element={<Settings />} />
      <Route path="/dcc" exact element={<DccDashboard />} />
      {layout?.modules && layout.modules.map(getRoutedModule)}
    </Routes>)
}

export default Modules;