import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, CircularProgress, Button, useTheme, useMediaQuery, Switch } from '@mui/material';

import { useAppDispatch, useAppSelector } from '@/store';
import { logout } from '@/store/api';
import { setMode } from '@/store/slices/app.slice';

export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { mode } = useAppSelector((state) => state.app);

  const theme = useTheme();

  console.log(theme);

  const onLogout = async () => {
    setIsLoading(true);
    dispatch(logout(navigate));
    setIsLoading(false);
  };

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const handleThemeChange = () => {
    dispatch(setMode(theme.palette.mode === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    dispatch(setMode(prefersDarkMode ? 'dark' : 'light'));
  }, [prefersDarkMode]);

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
      <Switch sx={{ position: 'absolute', top: 10, right: 0, zIndex: 100 }} checked={mode === 'light'} onChange={handleThemeChange} />

      <Box sx={{ height: '100%', overflow: 'auto', p: 2, pt: 5, display: 'flex', flexDirection: 'column' }}>
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
