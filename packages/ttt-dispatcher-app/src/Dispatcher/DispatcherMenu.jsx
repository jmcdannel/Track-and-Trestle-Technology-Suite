import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useTurnoutStore } from '../Store/useTurnoutStore';

import './DispatcherMenu.scss';

export const DispatcherMenu = props => {

  const { setTurnouts, dispatcherLayout } = props;
  const turnouts = useTurnoutStore(state => state.turnouts);  

  const handleTurnoutsAction = async action => {
    switch(action) {
      case 'straight':
        await setTurnouts(turnouts.map(t => ({ turnoutId: t.turnoutId, state: true })));
        break;
      case 'divergent':
        await setTurnouts(turnouts.map(t => ({ turnoutId: t.turnoutId, state: false })));
        break;
      case 'toggle':
        await setTurnouts(turnouts.map(t => ({ turnoutId: t.turnoutId, state: !t.state })));
        break;
      case 'sweep':
        await setTurnouts(turnouts.map(t => ({ turnoutId: t.turnoutId, state: !t.state })));
        await setTurnouts(turnouts.map(t => ({ turnoutId: t.turnoutId, state: !t.state })));
        break;
      default:
        // no op
        break;
    }
  }

  const hanldeLayoutClick = async event => {
    
  };

  return (
    <AppBar position="relative" className="menu" color="secondary">
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <ButtonGroup color="secondary" variant="contained">
          <Button onClick={() => handleTurnoutsAction('straight')}>All Straight</Button>
          <Button onClick={() => handleTurnoutsAction('divergent')}>All Divergent</Button>
          <Button onClick={() => handleTurnoutsAction('toggle')}>Toggle All</Button>
          <Button onClick={() => handleTurnoutsAction('sweep')}>Sweep All</Button> 
        </ButtonGroup>
        <Box>
          <FormControlLabel control={
            <Switch 
              checked={dispatcherLayout.map}
              onChange={hanldeLayoutClick}
              value="map"
              color="secondary"
            />
          } label="Show Map" />

          <FormControlLabel control={
            <Switch 
              checked={dispatcherLayout.routes}
              onChange={hanldeLayoutClick}
              value="routes"
              color="secondary"
            />
          } label="Show routes" />

          <FormControlLabel control={
            <Switch 
              checked={dispatcherLayout.turnouts}
              onChange={hanldeLayoutClick}
              value="turnouts"
              color="secondary"
            />
          } label="Show turnouts" />

        </Box>
      </Toolbar>
    </AppBar>
  );

}

DispatcherMenu.defaultProps = {
  view: 'tiny'
};

export default DispatcherMenu;