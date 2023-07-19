import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import { Context } from '../Store/Store';
import Effect from './Effect';
import './Effects.scss';

export const Effects = () => {

  const [ state ] = useContext(Context);
  const { effects } = state;

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