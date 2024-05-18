import React from 'react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardContent';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

import { useEffectStore } from '../Store/useEffectStore';
import { useTurnoutStore } from '../Store/useTurnoutStore';

export const Pinout = props => {
  const effects = useEffectStore(state => state.effects);
  const turnouts = useTurnoutStore(state => state.turnouts);
  
  // const debug = () => JSON.stringify(state, null, 2);

  const pins = () => {
    console.log(effects, turnouts);
    const turnoutsPins = [];
    // const turnouts = state?.turnouts?.reduce((acc, turnout) => {
    //   if (turnout.type === "servo") {
    //     acc.push({
    //       pin: turnout.servo,
    //       type: turnout.type,
    //       name: turnout.name,
    //       interface: turnout.interface
    //     });
    //   }
    //   if (turnout.relay) {
    //     acc.push({
    //       pin: turnout.relay.pin,
    //       type: 'relay',
    //       name: turnout.name,
    //       interface: turnout.relay.interface
    //     });
    //   }
    //   if (turnout.relayCrossover) {
    //     acc.push({
    //       pin: turnout.relayCrossover.pin,
    //       type: 'relay',
    //       name: turnout.name,
    //       interface: turnout.relayCrossover.interface
    //     });
    //   }
    //   return acc;
    // }, []);
    const effectsPins = effects?.reduce((acc, effect) => {
      
      if (effect.type === 'signal') {
        ['red', 'yellow', 'green'].forEach(state => {
          effect.config[state] && acc.push({
            pin: effect.config[state],
            type: effect.type,
            effectId: effect.effectId,
            name: effect.name + ' ' + state,
            interface: effect.config.interface
          });
        });
        
      } else if (effect.config?.pin) {
          acc.push({
            pin: effect.config.pin,
            type: effect.type,
            name: effect.name,
            effectId: effect.effectId,
            interface: effect.config.interface
          });
        }
      return acc;
    }, []);
    return [...turnoutsPins || [], ...effectsPins || []];

  }

  const interfaces = () => pins().reduce((acc, pin) => {
    if (!acc.includes(pin.interface)) {
      acc.push(pin.interface);
    }
    return acc;
  }, []);

  const interfacePins = iface => pins().filter(pin => pin.interface === iface).sort((a, b) => a.pin - b.pin);

  console.log(interfaces());

  return (
    <Grid container
      direction="row" spacing={2}
      justifyContent="flex-start"
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
                  <tr key={`${pin.effectId}--${pin.interface}`}>
                    <td>{pin.pin}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{pin.name}</td>
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