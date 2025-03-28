import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

function Header() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          AI-POWERED TETANUS MONITORING
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

