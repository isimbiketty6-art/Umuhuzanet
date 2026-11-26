-- ============================================================================
-- Umuhuza Connect: Rwanda Agricultural Marketplace Database
-- Target Database: MySQL 8.0+
-- Scalability & Performance: Indexed foreign keys, InnoDB engine, utf8mb4 collation
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `umuhuza_connect` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `umuhuza_connect`;

-- 1. Users Table (Role-based: customer, seller, trader, admin)
CREATE TABLE IF NOT EXISTS `users` (
    `user_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `phone` VARCHAR(25) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('customer', 'seller', 'trader', 'admin') NOT NULL DEFAULT 'customer',
    `location` VARCHAR(100) NOT NULL COMMENT 'District or City (e.g. Kigali, Musanze)',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_role` (`role`),
    INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Sellers / Farmers Table
CREATE TABLE IF NOT EXISTS `sellers` (
    `seller_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `business_name` VARCHAR(180) NOT NULL,
    `description` TEXT NULL,
    `location` VARCHAR(100) NOT NULL,
    `province` ENUM('Kigali', 'Northern', 'Southern', 'Eastern', 'Western') NOT NULL,
    `verification_status` ENUM('pending', 'verified', 'rejected') DEFAULT 'verified',
    `momo_merchant_code` VARCHAR(50) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    INDEX `idx_sellers_verification` (`verification_status`),
    INDEX `idx_sellers_province` (`province`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS `categories` (
    `category_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `name_rw` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `icon` VARCHAR(50) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Products Table (Agricultural Produce & Inputs)
CREATE TABLE IF NOT EXISTS `products` (
    `product_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `seller_id` BIGINT UNSIGNED NOT NULL,
    `category_id` INT UNSIGNED NOT NULL,
    `name` VARCHAR(180) NOT NULL,
    `name_rw` VARCHAR(180) NOT NULL,
    `description` TEXT NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL COMMENT 'Price in Rwandan Francs (RWF)',
    `unit` VARCHAR(30) NOT NULL DEFAULT 'kg' COMMENT 'kg, liter, crate, sack, head',
    `quantity` INT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Stock level',
    `location` VARCHAR(100) NOT NULL,
    `image` VARCHAR(255) NULL,
    `status` ENUM('available', 'out_of_stock', 'hidden') DEFAULT 'available',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`seller_id`) REFERENCES `sellers` (`seller_id`) ON DELETE CASCADE,
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE RESTRICT,
    INDEX `idx_products_category` (`category_id`),
    INDEX `idx_products_price` (`price`),
    INDEX `idx_products_status` (`status`),
    FULLTEXT `ft_products_search` (`name`, `description`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS `orders` (
    `order_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `customer_id` BIGINT UNSIGNED NOT NULL,
    `total_amount` DECIMAL(12, 2) NOT NULL COMMENT 'Total RWF',
    `status` ENUM('Pending', 'Processing', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    `delivery_district` VARCHAR(80) NOT NULL,
    `delivery_address` TEXT NOT NULL,
    `payment_method` ENUM('MTN MoMo', 'Airtel Money', 'Cash on Delivery') NOT NULL DEFAULT 'MTN MoMo',
    `payment_status` ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT,
    INDEX `idx_orders_status` (`status`),
    INDEX `idx_orders_customer` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Order Items Table
CREATE TABLE IF NOT EXISTS `order_items` (
    `order_item_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `order_id` BIGINT UNSIGNED NOT NULL,
    `product_id` BIGINT UNSIGNED NOT NULL,
    `quantity` INT UNSIGNED NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL COMMENT 'Unit price at moment of purchase',
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT,
    INDEX `idx_order_items_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Messages Table (Buyer-Seller Direct Communication)
CREATE TABLE IF NOT EXISTS `messages` (
    `message_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `sender_id` BIGINT UNSIGNED NOT NULL,
    `receiver_id` BIGINT UNSIGNED NOT NULL,
    `message` TEXT NOT NULL,
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    INDEX `idx_messages_conversation` (`sender_id`, `receiver_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Reviews Table
CREATE TABLE IF NOT EXISTS `reviews` (
    `review_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `customer_id` BIGINT UNSIGNED NOT NULL,
    `seller_id` BIGINT UNSIGNED NOT NULL,
    `product_id` BIGINT UNSIGNED NULL,
    `rating` TINYINT UNSIGNED NOT NULL COMMENT '1 to 5 stars',
    `comment` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`seller_id`) REFERENCES `sellers` (`seller_id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE SET NULL,
    INDEX `idx_reviews_seller` (`seller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Agri Jobs Table (From Infographic #2 Agricultural Job Seek Portal)
CREATE TABLE IF NOT EXISTS `agri_jobs` (
    `job_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `employer_id` BIGINT UNSIGNED NOT NULL,
    `title` VARCHAR(180) NOT NULL,
    `company` VARCHAR(150) NOT NULL,
    `location` VARCHAR(100) NOT NULL,
    `district` VARCHAR(80) NOT NULL,
    `job_type` ENUM('Full-time', 'Part-time', 'Seasonal', 'Contract') NOT NULL DEFAULT 'Full-time',
    `salary_rwf` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `status` ENUM('Open', 'Filled', 'Closed') DEFAULT 'Open',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`employer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED DATA: Rwandan Agricultural Categories & Produce
-- ============================================================================

INSERT INTO `categories` (`name`, `name_rw`, `description`, `icon`) VALUES
('Vegetables', 'Imboga', 'Fresh local greens, tomatoes, carrots, onions', 'vegetable'),
('Fruits', 'Imbuto', 'Bananas, pineapples, avocados, passion fruits', 'fruit'),
('Grains & Cereals', 'Impeke n\'Ibinyamisogwe', 'Dry beans, maize, rice, sorghum, wheat', 'grain'),
('Livestock', 'Amatungo', 'Dairy cows, goats, sheep, poultry and eggs', 'livestock'),
('Dairy Products', 'Ibikomoka ku Mata', 'Fresh milk, pasteurized milk, butter, cheese', 'dairy'),
('Seeds & Inputs', 'Imbuto zo Gutera n\'Ifumbire', 'Certified certified seeds, organic compost, fertilizers', 'seed'),
('Processed Foods', 'Ibiribwa Bitunganije', 'Akabanga chili oil, honey, cassava flour, roasted coffee', 'processed'),
('Tools & Equipment', 'Ibikoresho by\'Ubuhinzi', 'Hoes, watering cans, drip kits, sprayers', 'tools');
