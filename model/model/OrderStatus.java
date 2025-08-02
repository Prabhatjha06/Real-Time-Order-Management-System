package com.orderms.model;

public enum OrderStatus {
    ORDER_PLACED("Order Placed"),
    ORDER_PROCESSING("Processing"),
    ORDER_READY("Ready for Delivery"),
    ORDER_DELIVERED("Delivered"),
    ORDER_CANCELLED("Cancelled");
    
    private final String displayName;
    
    OrderStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
