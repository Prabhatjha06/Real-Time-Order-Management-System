import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Add, List } from '@mui/icons-material';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <ShoppingCart sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Order Management System
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<List />}
            onClick={() => navigate('/orders')}
            variant={location.pathname === '/orders' || location.pathname === '/' ? 'outlined' : 'text'}
          >
            All Orders
          </Button>
          <Button
            color="inherit"
            startIcon={<Add />}
            onClick={() => navigate('/orders/new')}
            variant={location.pathname === '/orders/new' ? 'outlined' : 'text'}
          >
            New Order
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
