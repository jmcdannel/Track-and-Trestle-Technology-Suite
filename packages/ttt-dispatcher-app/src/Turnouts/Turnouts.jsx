import React, { useContext } from 'react';
import Turnout from '../Turnouts/Turnout';
import { Context } from '../Store/Store';

const Turnouts = () => {
  
  const [ state, dispatch ] = useContext(Context);
  const { turnouts, layout } = state;

  const handleTurnoutChange = async delta => {
    try {
      await dispatch({ type: 'UPDATE_TURNOUT', payload: delta });
    } catch (err) {
      console.error(err);
      // throw err;
    }   
  }

  const renderTurnouts = list => list
    ?.sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by the abbr property
    .map(renderTurnout);

  const renderTurnout = turnout => {
    return (
      <Turnout key={turnout.turnoutId} turnout={turnout} handleTurnoutChange={handleTurnoutChange} />
    );
  };

  return (
    <>
      {layout?.meta?.lines
        .sort((a, b) => a.abbr.localeCompare(b.abbr)) // Sort alphabetically by the abbr property
        .map(line => renderTurnouts(turnouts.filter(turnout => turnout?.meta?.line === line.id)))
      }
      {renderTurnouts(turnouts?.filter(turnout => !turnout?.meta?.line))}
    </>
  );
};

export default Turnouts;