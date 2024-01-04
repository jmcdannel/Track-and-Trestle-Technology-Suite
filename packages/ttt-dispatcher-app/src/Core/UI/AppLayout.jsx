import React from 'react';
import Box from '@mui/material/Box';

function AppLayout({ header, body, footer }) {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      height="100%">
      <Box>
        {header}
      </Box>
      <Box 
        className="disable-dbl-tap-zoom"
        flexGrow={1} 
        component="main" 
        display="flex" 
        alignContent="center" 
        mt={2}
      >
        {body}
      </Box>
      <Box mt={1}>
        {footer}
      </Box>
    </Box>
  )
}

export default AppLayout;
