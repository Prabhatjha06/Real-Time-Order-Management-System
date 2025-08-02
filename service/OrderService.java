package com.orderms.service;

import com.orderms.dto.OrderRequest;
import com.orderms.model.Order;
import com.orderms.model.OrderItem;
import com.orderms.model.OrderStatus;
import com.orderms.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    public Order createOrder(OrderRequest orderRequest) {
        Order order = new Order();
        order.setCustomerId(orderRequest.getCustomerId());
        order.setCustomerName(orderRequest.getCustomerName());
        order.setCustomerEmail(orderRequest.getCustomerEmail());
        order.setCustomerPhone(orderRequest.getCustomerPhone());
        order.setDeliveryAddress(orderRequest.getDeliveryAddress());
        order.setOrderNotes(orderRequest.getOrderNotes());
        
        // Add items
        for (OrderRequest.OrderItemRequest itemRequest : orderRequest.getItems()) {
            OrderItem item = new OrderItem();
            item.setProductName(itemRequest.getProductName());
            item.setProductDescription(itemRequest.getProductDescription());
            item.setQuantity(itemRequest.getQuantity());
            item.setPrice(itemRequest.getPrice());
            item.setCategory(itemRequest.getCategory());
            order.addItem(item);
        }
        
        Order savedOrder = orderRepository.save(order);
        
        // Send notification asynchronously
        notificationService.sendOrderNotification(savedOrder, "New order placed successfully!");
        
        return savedOrder;
    }
    
    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }
    
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }
    
    public List<Order> getOrdersByCustomerId(String customerId) {
        return orderRepository.findByCustomerId(customerId);
    }
    
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }
    
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            OrderStatus oldStatus = order.getStatus();
            order.setStatus(newStatus);
            Order updatedOrder = orderRepository.save(order);
            
            // Send status update notification
            String message = String.format("Order status updated from %s to %s", 
                oldStatus.getDisplayName(), newStatus.getDisplayName());
            notificationService.sendOrderNotification(updatedOrder, message);
            
            return updatedOrder;
        }
        throw new RuntimeException("Order not found with id: " + orderId);
    }
    
    public Order updateOrder(Long orderId, OrderRequest orderRequest) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            
            // Update order details
            order.setCustomerName(orderRequest.getCustomerName());
            order.setCustomerEmail(orderRequest.getCustomerEmail());
            order.setCustomerPhone(orderRequest.getCustomerPhone());
            order.setDeliveryAddress(orderRequest.getDeliveryAddress());
            order.setOrderNotes(orderRequest.getOrderNotes());
            
            // Clear existing items and add new ones
            order.getItems().clear();
            for (OrderRequest.OrderItemRequest itemRequest : orderRequest.getItems()) {
                OrderItem item = new OrderItem();
                item.setProductName(itemRequest.getProductName());
                item.setProductDescription(itemRequest.getProductDescription());
                item.setQuantity(itemRequest.getQuantity());
                item.setPrice(itemRequest.getPrice());
                item.setCategory(itemRequest.getCategory());
                order.addItem(item);
            }
            
            Order updatedOrder = orderRepository.save(order);
            notificationService.sendOrderNotification(updatedOrder, "Order updated successfully!");
            
            return updatedOrder;
        }
        throw new RuntimeException("Order not found with id: " + orderId);
    }
    
    public void deleteOrder(Long orderId) {
        if (orderRepository.existsById(orderId)) {
            orderRepository.deleteById(orderId);
        } else {
            throw new RuntimeException("Order not found with id: " + orderId);
        }
    }
    
    public long getTotalOrderCount() {
        return orderRepository.count();
    }
    
    public List<Order> searchOrders(String searchTerm) {
        return orderRepository.findByCustomerNameContainingIgnoreCaseOrCustomerEmailContainingIgnoreCase(
            searchTerm, searchTerm);
    }
}
