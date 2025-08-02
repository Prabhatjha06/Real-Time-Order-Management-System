package com.orderms.repository;

import com.orderms.model.Order;
import com.orderms.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByCustomerId(String customerId);
    
    List<Order> findByStatus(OrderStatus status);
    
    List<Order> findByCustomerIdAndStatus(String customerId, OrderStatus status);
    
    List<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Order> findByTotalAmountGreaterThan(Double amount);
    
    List<Order> findByCustomerNameContainingIgnoreCaseOrCustomerEmailContainingIgnoreCase(
        String customerName, String customerEmail);
    
    @Query("SELECT o FROM Order o WHERE o.customerId = :customerId AND o.createdAt >= :fromDate")
    List<Order> findRecentOrdersByCustomer(@Param("customerId") String customerId, 
                                         @Param("fromDate") LocalDateTime fromDate);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    long countByStatus(@Param("status") OrderStatus status);
    
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.id = :id")
    Order findByIdWithItems(@Param("id") Long id);
}
