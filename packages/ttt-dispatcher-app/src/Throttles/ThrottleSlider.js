import React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

export const ThrottleSlider = props => {

  const { speed, autoStop, onChange, max } = props;

  const step = max > 30 ? 10 : 5;
  const marks = Array.apply(null, Array(max * 2 / step + 1)).map((x, i) => {
    const mark = (max * -1) + i * step;
    return {
      label: mark,
      value: mark
    };
  });

  const handleChange = (event, newValue) => {
    onChange(newValue);
  };

  const handleChangeCommitted = (event, newValue) => {
    console.log('handleChangeCommitted', autoStop);
    if (autoStop) {
      onChange(0);
    }
  };

  return (
    <Box display="flex" className="throttle__slider__container">
      <Slider
        orientation="vertical"
        defaultValue={0}
        min={-max}
        max={max}
        marks={marks}
        value={speed}
        track={false}
        aria-labelledby="vertical-slider"
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
        className={`throttle__slider 
        ${speed < 0 
          ? 'throttle__speed--reverse' 
          : 'throttle__speed--forward'}`}
          
      />
    </Box>
  );

}

export default ThrottleSlider;