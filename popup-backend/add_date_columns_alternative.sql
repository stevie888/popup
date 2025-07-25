-- Comprehensive Umbrella Rental System Database Schema
-- This script creates all necessary tables for the umbrella rental application

USE popup;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS credit_transactions;
DROP TABLE IF EXISTS rental_history;
DROP TABLE IF EXISTS umbrellas;
DROP TABLE IF EXISTS stations;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(20),
    credits INT DEFAULT 200,
    total_rentals INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create stations table
CREATE TABLE stations (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    total_umbrellas INT DEFAULT 0,
    available_umbrellas INT DEFAULT 0,
    status ENUM('available', 'out_of_stock', 'maintenance') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create umbrellas table
CREATE TABLE umbrellas (
    id VARCHAR(36) PRIMARY KEY,
    station_id VARCHAR(36) NOT NULL,
    status ENUM('available', 'rented', 'maintenance', 'lost') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE
);

-- Create rental_history table
CREATE TABLE rental_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    umbrella_id VARCHAR(36) NOT NULL,
    station_id VARCHAR(36) NOT NULL,
    rented_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returned_at TIMESTAMP NULL,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    credits_used INT DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (umbrella_id) REFERENCES umbrellas(id) ON DELETE CASCADE,
    FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE
);

-- Create credit_transactions table
CREATE TABLE credit_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type ENUM('rental', 'topup', 'bonus', 'refund') NOT NULL,
    amount INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample data

-- Sample users
INSERT INTO users (id, username, email, password, name, mobile, credits) VALUES
('user-001', 'john.doe', 'john@example.com', '$2b$10$hashedpassword', 'John Doe', '+1234567890', 300),
('user-002', 'jane.smith', 'jane@example.com', '$2b$10$hashedpassword', 'Jane Smith', '+1234567891', 150),
('user-003', 'admin', 'admin@umbrella.com', '$2b$10$hashedpassword', 'Admin User', '+1234567892', 1000);

-- Sample stations
INSERT INTO stations (id, name, location, latitude, longitude, total_umbrellas, available_umbrellas) VALUES
('station-001', 'Central Park Station', 'Central Park, New York', 40.7829, -73.9654, 20, 15),
('station-002', 'Times Square Station', 'Times Square, New York', 40.7580, -73.9855, 15, 10),
('station-003', 'Brooklyn Bridge Station', 'Brooklyn Bridge, New York', 40.7061, -73.9969, 25, 20),
('station-004', 'Central Station', 'Downtown, New York', 40.7128, -74.0060, 30, 25);

-- Sample umbrellas
INSERT INTO umbrellas (id, station_id, status) VALUES
('umbrella-001', 'station-001', 'available'),
('umbrella-002', 'station-001', 'available'),
('umbrella-003', 'station-001', 'available'),
('umbrella-004', 'station-001', 'available'),
('umbrella-005', 'station-001', 'available'),
('umbrella-006', 'station-002', 'available'),
('umbrella-007', 'station-002', 'available'),
('umbrella-008', 'station-002', 'available'),
('umbrella-009', 'station-002', 'available'),
('umbrella-010', 'station-002', 'available'),
('umbrella-011', 'station-003', 'available'),
('umbrella-012', 'station-003', 'available'),
('umbrella-013', 'station-003', 'available'),
('umbrella-014', 'station-003', 'available'),
('umbrella-015', 'station-003', 'available'),
('umbrella-016', 'station-004', 'available'),
('umbrella-017', 'station-004', 'available'),
('umbrella-018', 'station-004', 'available'),
('umbrella-019', 'station-004', 'available'),
('umbrella-020', 'station-004', 'available');

-- Sample credit transactions
INSERT INTO credit_transactions (user_id, type, amount, description, method) VALUES
('user-001', 'topup', 200, 'Initial credit top up', 'mobile_money'),
('user-001', 'rental', -50, 'Umbrella rental at Central Park', NULL),
('user-002', 'topup', 100, 'Credit top up', 'card'),
('user-002', 'rental', -50, 'Umbrella rental at Times Square', NULL),
('user-003', 'bonus', 100, 'Welcome bonus', NULL);

-- Sample rental history
INSERT INTO rental_history (user_id, umbrella_id, station_id, rented_at, status, credits_used) VALUES
('user-001', 'umbrella-001', 'station-001', DATE_SUB(NOW(), INTERVAL 2 HOUR), 'completed', 50),
('user-002', 'umbrella-006', 'station-002', DATE_SUB(NOW(), INTERVAL 1 HOUR), 'active', 50);

-- Update station available umbrellas based on current rentals
UPDATE stations s 
SET available_umbrellas = (
    SELECT COUNT(*) 
    FROM umbrellas u 
    WHERE u.station_id = s.id AND u.status = 'available'
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_rental_history_user_id ON rental_history(user_id);
CREATE INDEX idx_rental_history_status ON rental_history(status);
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_umbrellas_station_id ON umbrellas(station_id);
CREATE INDEX idx_umbrellas_status ON umbrellas(status);

-- Show the created tables
SHOW TABLES;

-- Show sample data
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Stations', COUNT(*) FROM stations
UNION ALL
SELECT 'Umbrellas', COUNT(*) FROM umbrellas
UNION ALL
SELECT 'Rental History', COUNT(*) FROM rental_history
UNION ALL
SELECT 'Credit Transactions', COUNT(*) FROM credit_transactions; 