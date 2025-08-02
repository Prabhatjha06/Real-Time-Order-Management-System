package com.orderms.service;

import com.orderms.model.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.PublishRequest;
import software.amazon.awssdk.services.sns.model.SnsException;

@Service
public class NotificationService {
    
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    
    @Autowired(required = false)
    private SnsClient snsClient;
    
    @Value("${aws.sns.topic-arn:}")
    private String topicArn;
    
    @Value("${notifications.enabled:false}")
    private boolean notificationsEnabled;
    
    @Async
    public void sendOrderNotification(Order order, String message) {
        try {
            if (!notificationsEnabled) {
                logger.info("Notifications disabled. Would send: Order ID: {}, Customer: {}, Message: {}", 
                    order.getId(), order.getCustomerName(), message);
                return;
            }
            
            if (snsClient == null || topicArn.isEmpty()) {
                logger.warn("SNS not configured. Skipping notification for order: {}", order.getId());
                return;
            }
            
            String notificationMessage = createNotificationMessage(order, message);
            
            PublishRequest request = PublishRequest.builder()
                .topicArn(topicArn)
                .message(notificationMessage)
                .subject("Order Update - " + order.getId())
                .build();
                
            snsClient.publish(request);
            logger.info("Notification sent for order: {}", order.getId());
            
        } catch (SnsException e) {
            logger.error("Failed to send SNS notification for order {}: {}", order.getId(), e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error sending notification for order {}: {}", order.getId(), e.getMessage());
        }
    }
    
    private String createNotificationMessage(Order order, String message) {
        return String.format(
            "Order Update\n" +
            "Order ID: %d\n" +
            "Customer: %s\n" +
            "Email: %s\n" +
            "Status: %s\n" +
            "Total Amount: $%.2f\n" +
            "Message: %s\n" +
            "Time: %s",
            order.getId(),
            order.getCustomerName(),
            order.getCustomerEmail(),
            order.getStatus().getDisplayName(),
            order.getTotalAmount(),
            message,
            order.getUpdatedAt()
        );
    }
    
    @Async
    public void sendBulkNotification(String message) {
        try {
            if (!notificationsEnabled || snsClient == null || topicArn.isEmpty()) {
                logger.info("Bulk notification disabled or not configured: {}", message);
                return;
            }
            
            PublishRequest request = PublishRequest.builder()
                .topicArn(topicArn)
                .message(message)
                .subject("System Notification")
                .build();
                
            snsClient.publish(request);
            logger.info("Bulk notification sent");
            
        } catch (Exception e) {
            logger.error("Failed to send bulk notification: {}", e.getMessage());
        }
    }
}
