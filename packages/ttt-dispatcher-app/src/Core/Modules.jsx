import React, { useContext } from 'react';
import { Route, Routes } from "react-router-dom";
import Conductor from '../Conductor/Conductor';
import Pinout from '../Settings/Pinout';
import Dispatcher from '../Dispatcher/Dispatcher';
import Throttles from '../Throttles/Throttles';
import Effects from '../Effects/Effects';
import { Context } from '../Store/Store';

function Modules(props) {

  const [ state ] = useContext(Context);
  const { locos, turnouts, effects, userPreferences, layout } = state;
  const { modules } = layout;
  const loading = (<div>Loading</div>);

  console.log('Modules', state, modules);

  const getRoutedModule = module => {
    switch(module) {
      case 'locos' :
        return (
          <Route path="/throttles" key={module} element={
            locos ? (<Throttles />) : loading
          } />
        );
      case 'turnouts' :
        return (
          <Route path="/dispatcher" key={module} element={
            turnouts && <Dispatcher view={userPreferences.turnoutView} />
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

  return modules ? (
    <Routes>
      <Route path="/" exact element={locos ? <Conductor /> : loading} />
      <Route path="/pinout" exact element={<Pinout />} />
      {modules.map(getRoutedModule)}
    </Routes>) : <></>;
}

export default Modules;