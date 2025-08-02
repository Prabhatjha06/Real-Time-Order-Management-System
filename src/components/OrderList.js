import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  Add,
  Refresh,
  Search,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { orderService } from '../services/orderService';

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [stats, setStats] = useState({});

  const orderStatuses = [
    'ALL',
    'ORDER_PLACED',
    'ORDER_PROCESSING',
    'ORDER_READY',
    'ORDER_DELIVERED',
    'ORDER_CANCELLED'
  ];

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrdersSimple();
      setOrders(data);
      toast.success('Orders loaded successfully');
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await orderService.getOrderStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm)
      );
    }

    setFilteredOrders(filtered);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
      await fetchStats();
      toast.success(`Order status updated to ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      await orderService.deleteOrder(orderToDelete.id);
      await fetchOrders();
      await fetchStats();
      toast.success('Order deleted successfully');
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ORDER_PLACED: 'primary',
      ORDER_PROCESSING: 'warning',
      ORDER_READY: 'info',
      ORDER_DELIVERED: 'success',
      ORDER_CANCELLED: 'error'
    };
    return colors[status] || 'default';
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      ORDER_PLACED: 'ORDER_PROCESSING',
      ORDER_PROCESSING: 'ORDER_READY',
      ORDER_READY: 'ORDER_DELIVERED'
    };
    return statusFlow[currentStatus];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading orders...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Order Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/orders/new')}
        >
          New Order
        </Button>
      </Box>

      {/* Stats Section */}
      {stats.totalOrders && (
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Orders
                </Typography>
                <Typography variant="h5">
                  {stats.totalOrders}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {stats.statusCounts && Object.entries(stats.statusCounts).map(([status, count]) => (
            <Grid item xs={12} sm={6} md={2} key={status}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    {status.replace('_', ' ')}
                  </Typography>
                  <Typography variant="h6">
                    {count}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Filters Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Search orders..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Filter by Status"
              variant="outlined"
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {orderStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status === 'ALL' ? 'All Statuses' : status.replace('_', ' ')}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchOrders}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No orders found
          </Typography>
          <Typography color="textSecondary" mb={2}>
            {orders.length === 0 ? 'Start by creating your first order' : 'Try adjusting your search or filters'}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/orders/new')}>
            Create First Order
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredOrders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" component="div">
                      Order #{order.id}
                    </Typography>
                    <Chip
                      label={order.status.replace('_', ' ')}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography color="textSecondary" variant="body2" mb={1}>
                    <strong>Customer:</strong> {order.customerName}
                  </Typography>
                  
                  <Typography color="textSecondary" variant="body2" mb={1}>
                    <strong>Email:</strong> {order.customerEmail}
                  </Typography>
                  
                  <Typography color="textSecondary" variant="body2" mb={1}>
                    <strong>Total:</strong> ${order.totalAmount?.toFixed(2)}
                  </Typography>
                  
                  <Typography color="textSecondary" variant="body2" mb={1}>
                    <strong>Items:</strong> {order.items?.length || 0}
                  </Typography>
                  
                  <Typography color="textSecondary" variant="body2" mb={2}>
                    <strong>Created:</strong> {formatDate(order.createdAt)}
                  </Typography>
                  
                  {order.deliveryAddress && (
                    <Typography color="textSecondary" variant="body2" mb={1}>
                      <strong>Address:</strong> {order.deliveryAddress}
                    </Typography>
                  )}
                </CardContent>
                
                <CardActions sx={{ padding: 2, paddingTop: 0 }}>
                  <Box display="flex" justifyContent="space-between" width="100%">
                    <Box>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Edit Order">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/orders/${order.id}/edit`)}
                          disabled={order.status === 'ORDER_DELIVERED' || order.status === 'ORDER_CANCELLED'}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Delete Order">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setOrderToDelete(order);
                            setDeleteDialogOpen(true);
                          }}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    <Box>
                      {getNextStatus(order.status) && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleStatusUpdate(order.id, getNextStatus(order.status))}
                        >
                          {getNextStatus(order.status).replace('_', ' ')}
                        </Button>
                      )}
                      
                      {order.status !== 'ORDER_CANCELLED' && order.status !== 'ORDER_DELIVERED' && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleStatusUpdate(order.id, 'ORDER_CANCELLED')}
                          sx={{ ml: 1 }}
                        >
                          Cancel
                        </Button>
                      )}
                    </Box>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => navigate('/orders/new')}
      >
        <Add />
      </Fab>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete Order #{orderToDelete?.id}?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteOrder} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderList;
