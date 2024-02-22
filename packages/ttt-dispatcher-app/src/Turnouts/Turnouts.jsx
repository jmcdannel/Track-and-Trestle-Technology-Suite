import React, { useContext } from 'react';
import Turnout from '../Turnouts/Turnout';
import { useTurnoutStore } from '../Store/useTurnoutStore';
import { Context } from '../Store/Store';
import api from '../Shared/api/api';

const Turnouts = () => {
  
  const [ state, dispatch ] = useContext(Context);
  const turnouts = useTurnoutStore(state => state.turnouts);
  const { layout } = state;

  const renderTurnouts = list => list
    ?.sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by the abbr property
    .map(turnout => <Turnout key={turnout.turnoutId} turnout={turnout} />);

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