import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { logout } from '@/store/api';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, CircularProgress, Button, useTheme } from '@mui/material';

export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();

  console.log(theme);

  const onLogout = async () => {
    setIsLoading(true);
    dispatch(logout(navigate));
    setIsLoading(false);
  };

  return (
    <Drawer
      variant='permanent'
      anchor='left'
      sx={{
        width: 240,
        flexShrink: 0,
        backgroundColor: 'tertiary',
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          // backgroundColor: theme.palette.primary.main,
        },
      }}
    >
      <Box sx={{ height: '100%', overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton component={NavLink} to='/library'>
              <ListItemText primary='Library' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={NavLink} to='/dashboard'>
              <ListItemText primary='Dashboard' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={NavLink} to='/lab'>
              <ListItemText primary='Lab' />
            </ListItemButton>
          </ListItem>
        </List>
        <Box sx={{ mt: 'auto', mb: 1 }}>
          <Button fullWidth variant='contained' color='primary' onClick={onLogout} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Logout'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
