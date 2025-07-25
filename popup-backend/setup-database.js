const mysql = require('mysql2/promise');

async function setupDatabase() {
  let connection;
  
  try {
    // Connect to MySQL without specifying database
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Test@123',
      port: 3306
    });

    console.log('✅ Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.execute('CREATE DATABASE IF NOT EXISTS popup');
    console.log('✅ Database "popup" created/verified');

    // Use the popup database
    await connection.execute('USE popup');
    console.log('✅ Using popup database');

    // Create tables
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
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
      )
    `);
    console.log('✅ Users table created');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS stations (
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
    console.log('✅ Stations table created');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS umbrellas (
        id VARCHAR(36) PRIMARY KEY,
        station_id VARCHAR(36) NOT NULL,
        status ENUM('available', 'rented', 'maintenance', 'lost') DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Umbrellas table created');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS rental_history (
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
    console.log('✅ Rental history table created');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS credit_transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        type ENUM('rental', 'topup', 'bonus', 'refund') NOT NULL,
        amount INT NOT NULL,
        description VARCHAR(255) NOT NULL,
        method VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Credit transactions table created');

    // Insert sample data
    await connection.execute(`
      INSERT IGNORE INTO users (id, username, email, password, name, mobile, credits) VALUES
      ('user-001', 'john.doe', 'john@example.com', '$2b$10$hashedpassword', 'John Doe', '+1234567890', 300),
      ('user-002', 'jane.smith', 'jane@example.com', '$2b$10$hashedpassword', 'Jane Smith', '+1234567891', 150),
      ('user-003', 'admin', 'admin@umbrella.com', '$2b$10$hashedpassword', 'Admin User', '+1234567892', 1000)
    `);
    console.log('✅ Sample users inserted');

    await connection.execute(`
      INSERT IGNORE INTO stations (id, name, location, latitude, longitude, total_umbrellas, available_umbrellas) VALUES
      ('station-001', 'Central Park Station', 'Central Park, New York', 40.7829, -73.9654, 20, 15),
      ('station-002', 'Times Square Station', 'Times Square, New York', 40.7580, -73.9855, 15, 10),
      ('station-003', 'Brooklyn Bridge Station', 'Brooklyn Bridge, New York', 40.7061, -73.9969, 25, 20),
      ('station-004', 'Central Station', 'Downtown, New York', 40.7128, -74.0060, 30, 25)
    `);
    console.log('✅ Sample stations inserted');

    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase(); 