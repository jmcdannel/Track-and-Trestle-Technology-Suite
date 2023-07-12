import React, { useContext } from 'react';

import { Context } from '../Store/Store';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardContent';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';


export const Pinout = props => {
  const [ state ] = useContext(Context);

  // const debug = () => JSON.stringify(state, null, 2);

  const pins = () => {
    console.log(state);
    const turnouts = state?.turnouts?.reduce((acc, turnout) => {
      if (turnout.type === "servo") {
        acc.push({
          pin: turnout.servo,
          type: turnout.type,
          name: turnout.name,
          interface: turnout.interface
        });
      }
      if (turnout.relay) {
        acc.push({
          pin: turnout.relay.pin,
          type: 'relay',
          name: turnout.name,
          interface: turnout.relay.interface
        });
      }
      if (turnout.relayCrossover) {
        acc.push({
          pin: turnout.relayCrossover.pin,
          type: 'relay',
          name: turnout.name,
          interface: turnout.relayCrossover.interface
        });
      }
      return acc;
    }, []);
    const effects = state?.effects?.reduce((acc, effect) => {
      effect.actions.forEach(action => {
        if (action.pin) {
          acc.push({
            pin: action.pin,
            type: effect.type,
            name: effect.type === 'signal' 
              ? `${effect.name} (${action.state.substring(0, 1)})` 
              : effect.name,
            interface: action.interface
          });
        }
      });
      return acc;
    }, []);
    return [...turnouts || [], ...effects || []];

  }

  const interfaces = () => pins().reduce((acc, pin) => {
    if (!acc.includes(pin.interface)) {
      acc.push(pin.interface);
    }
    return acc;
  }, []);

  const interfacePins = iface => pins().filter(pin => pin.interface === iface);

  console.log(interfaces());

  return (
    <Grid container
      direction="row" spacing={2}
      justifyContent="space-between"
      alignItems="stretch">
      {interfaces().map(iface => (     
      <Grid key={iface} item xs={3} className="flex">   
          <Card className={`pinout`} style={{ width: '100%' }}>
            <CardHeader className="pinout__header">
                <h2>{iface}</h2>
            </CardHeader>
            <CardContent className="pinout__content">
              <table>
                <thead>
                  <tr>
                    <th>Pin</th>
                    <th>Name</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                {interfacePins(iface).map(pin => (
                  <tr key={`${pin.pin}--${pin.interface}`}>
                    <td>{pin.pin}</td>
                    <td>{pin.name}</td>
                    <td>{pin.type}</td>
                  </tr>
                ))}       
                </tbody>       
              </table>
              {/* <div style={{ overflow: 'auto' }} >
                <pre>{debug()}</pre>
              </div> */}
            </CardContent>
          </Card>
      </Grid>
      ))}
    </Grid>
  )

}

export default Pinout;