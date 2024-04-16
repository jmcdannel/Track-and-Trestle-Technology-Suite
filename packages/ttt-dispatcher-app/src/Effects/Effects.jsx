import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import { useEffectStore } from '../Store/useEffectStore';
import Effect from './Effect';
import './Effects.scss';

export const Effects = () => {

  const effects = useEffectStore(state => state.effects);

  console.log('effects', effects);

  return (
    <Grid container 
      className={`effects`} 
      spacing={1}
      justifyContent="flex-start"
      alignContent="flex-start">  
      {effects && effects.map(effect => (
        <Grid item key={`effect${effect.effectId}`} className="effects__grid-item" xs="auto">
            <Effect effect={effect} key={effect.effectId} />
        </Grid>
      ))}
    </Grid>    
  );

}

export default Effects;