-- Sample data for testing
INSERT INTO orders (customer_id, customer_name, customer_email, customer_phone, order_status, total_amount, delivery_address, order_notes, created_at, updated_at) VALUES
('CUST001', 'John Doe', 'john.doe@email.com', '+1-555-0101', 'ORDER_PLACED', 125.50, '123 Main St, New York, NY 10001', 'Please deliver before 6 PM', '2024-01-15 10:30:00', '2024-01-15 10:30:00'),
('CUST002', 'Jane Smith', 'jane.smith@email.com', '+1-555-0102', 'ORDER_PROCESSING', 89.99, '456 Oak Ave, Los Angeles, CA 90210', 'Leave at front door', '2024-01-15 11:15:00', '2024-01-15 11:45:00'),
('CUST003', 'Mike Johnson', 'mike.johnson@email.com', '+1-555-0103', 'ORDER_READY', 200.00, '789 Pine Blvd, Chicago, IL 60601', 'Call upon arrival', '2024-01-15 09:20:00', '2024-01-15 12:30:00'),
('CUST004', 'Sarah Williams', 'sarah.williams@email.com', '+1-555-0104', 'ORDER_DELIVERED', 75.25, '321 Elm St, Houston, TX 77001', 'Gift wrap requested', '2024-01-14 14:00:00', '2024-01-15 10:15:00'),
('CUST005', 'David Brown', 'david.brown@email.com', '+1-555-0105', 'ORDER_CANCELLED', 150.75, '654 Maple Dr, Phoenix, AZ 85001', 'Customer requested cancellation', '2024-01-14 16:30:00', '2024-01-15 08:45:00');

-- Sample order items
INSERT INTO order_items (order_id, product_name, product_description, quantity, price, category) VALUES
(1, 'Premium Coffee Beans', 'Organic Colombian Coffee, 1lb bag', 2, 24.99, 'Beverages'),
(1, 'Ceramic Mug', 'Handcrafted ceramic coffee mug', 2, 15.99, 'Accessories'),
(1, 'Coffee Grinder', 'Electric burr grinder', 1, 59.99, 'Appliances'),

(2, 'Chocolate Cake', 'Triple layer chocolate cake', 1, 45.99, 'Desserts'),
(2, 'Birthday Candles', 'Pack of 24 birthday candles', 1, 8.99, 'Party Supplies'),
(2, 'Gift Card', '$25 store gift card', 1, 25.00, 'Gift Cards'),

(3, 'Laptop Stand', 'Adjustable aluminum laptop stand', 1, 89.99, 'Electronics'),
(3, 'Wireless Mouse', 'Bluetooth wireless mouse', 1, 35.99, 'Electronics'),
(3, 'USB-C Cable', '6ft USB-C to USB-A cable', 2, 12.99, 'Electronics'),
(3, 'Screen Cleaner', 'Microfiber screen cleaning kit', 1, 9.99, 'Accessories'),

(4, 'Yoga Mat', 'Extra thick yoga mat with carrying strap', 1, 39.99, 'Fitness'),
(4, 'Water Bottle', 'Stainless steel insulated water bottle', 1, 24.99, 'Fitness'),
(4, 'Resistance Bands', 'Set of 5 resistance bands', 1, 19.99, 'Fitness'),

(5, 'Smart Watch', 'Fitness tracking smart watch', 1, 199.99, 'Electronics'),
(5, 'Watch Band', 'Silicone sport watch band', 2, 15.99, 'Accessories');
