const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Test@123',
    port: 3306
  });

  try {
    console.log('Connecting to MySQL...');
    
    // Create database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS popup');
    console.log('Database "popup" created/verified');
    
    // Use the database
    await connection.query('USE popup');
    
    // Drop all existing tables first
    console.log('Dropping existing tables...');
    await connection.query('DROP TABLE IF EXISTS credit_transactions');
    await connection.query('DROP TABLE IF EXISTS rental_history');
    await connection.query('DROP TABLE IF EXISTS umbrellas');
    await connection.query('DROP TABLE IF EXISTS stations');
    await connection.query('DROP TABLE IF EXISTS users');
    console.log('✓ All existing tables dropped');
    
    // Create tables manually
    console.log('Creating tables...');
    
    // Create users table
    await connection.query(`
      CREATE TABLE users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        mobile VARCHAR(20),
        role ENUM('user', 'admin') DEFAULT 'user',
        credits INT DEFAULT 200,
        total_rentals INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Users table created');
    
    // Create stations table
    await connection.query(`
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
      )
    `);
    console.log('✓ Stations table created');
    
    // Create umbrellas table
    await connection.query(`
      CREATE TABLE umbrellas (
        id VARCHAR(36) PRIMARY KEY,
        station_id VARCHAR(36) NOT NULL,
        status ENUM('available', 'rented', 'maintenance', 'lost') DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Umbrellas table created');
    
    // Create rental_history table
    await connection.query(`
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
      )
    `);
    console.log('✓ Rental history table created');
    
    // Insert sample data
    console.log('Inserting sample data...');
    
    // Sample users
    await connection.query(`
      INSERT INTO users (id, username, email, password, name, mobile, credits) VALUES
      ('user-001', 'john.doe', 'john@example.com', 'password123', 'John Doe', '1234567890', 300),
      ('user-002', 'jane.smith', 'jane@example.com', 'password123', 'Jane Smith', '1234567891', 150),
      ('user-003', 'admin', 'admin@umbrella.com', 'password123', 'Admin User', '1234567892', 1000)
    `);
    console.log('✓ Sample users inserted');
    
    // Sample stations
    await connection.query(`
      INSERT INTO stations (id, name, location, latitude, longitude, total_umbrellas, available_umbrellas) VALUES
      ('station-001', 'Central Park Station', 'Central Park, New York', 40.7829, -73.9654, 20, 15),
      ('station-002', 'Times Square Station', 'Times Square, New York', 40.7580, -73.9855, 15, 10),
      ('station-003', 'Brooklyn Bridge Station', 'Brooklyn Bridge, New York', 40.7061, -73.9969, 25, 20),
      ('station-004', 'Central Station', 'Downtown, New York', 40.7128, -74.0060, 30, 25)
    `);
    console.log('✓ Sample stations inserted');
    
    // Sample umbrellas
    await connection.query(`
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
      ('umbrella-010', 'station-002', 'available')
    `);
    console.log('✓ Sample umbrellas inserted');
    
    // Sample rental history
    await connection.query(`
      INSERT INTO rental_history (user_id, umbrella_id, station_id, rented_at, status, credits_used) VALUES
      ('user-001', 'umbrella-001', 'station-001', DATE_SUB(NOW(), INTERVAL 2 HOUR), 'completed', 50),
      ('user-002', 'umbrella-006', 'station-002', DATE_SUB(NOW(), INTERVAL 1 HOUR), 'active', 50)
    `);
    console.log('✓ Sample rental history inserted');
    
    // Create indexes
    console.log('Creating indexes...');
    await connection.query('CREATE INDEX idx_users_email ON users(email)');
    await connection.query('CREATE INDEX idx_users_username ON users(username)');
    await connection.query('CREATE INDEX idx_rental_history_user_id ON rental_history(user_id)');
    await connection.query('CREATE INDEX idx_rental_history_status ON rental_history(status)');
    await connection.query('CREATE INDEX idx_umbrellas_station_id ON umbrellas(station_id)');
    await connection.query('CREATE INDEX idx_umbrellas_status ON umbrellas(status)');
    console.log('✓ Indexes created');
    
    console.log('✅ Database setup completed successfully!');
    
    // Show tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('\n📋 Created tables:');
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    await connection.end();
  }
}

setupDatabase(); 