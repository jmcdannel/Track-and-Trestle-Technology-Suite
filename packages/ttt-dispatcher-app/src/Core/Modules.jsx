import React, { useContext } from 'react';
import { Route, Routes } from "react-router-dom";
import Conductor from '../Conductor/Conductor';
import Pinout from '../Settings/Pinout';
import Settings from '../Core/Settings';
import { Dashboard as DccDashboard } from '../Dcc/Dashboard';
import Dispatcher from '../Dispatcher/Dispatcher';
import Effects from '../Effects/Effects';
import { Context } from '../Store/Store';

function Modules(props) {

  const [ state ] = useContext(Context);
  const { locos, turnouts, effects, layout } = state;
  const loading = (<div>Loading</div>);

  const getRoutedModule = module => {
    switch(module) {
      case 'turnouts' :
        return (
          <Route path="/dispatcher" key={module} element={
            <Dispatcher />
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