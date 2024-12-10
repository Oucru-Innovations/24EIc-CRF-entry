import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import { Home, AdminPanelSettings, Menu } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function Sidebar({ expanded, onToggle }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: expanded ? 180 : 50,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: expanded ? 180 : 50,
          overflowX: 'hidden',
          transition: 'width 0.3s ease',
        },
      }}
    >
      <Box display="flex" justifyContent={expanded ? 'flex-end' : 'center'} p={1}>
        <Tooltip title={expanded ? 'Collapse' : 'Expand'}>
          <IconButton onClick={onToggle}>
            <Menu />
          </IconButton>
        </Tooltip>
      </Box>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          {expanded && <ListItemText primary="Home" />}
        </ListItem>
        <ListItem button component={Link} to="/admin">
          <ListItemIcon>
            <AdminPanelSettings />
          </ListItemIcon>
          {expanded && <ListItemText primary="Admin Page" />}
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Sidebar;
