/*
  # E-Commerce Platform Schema

  ## Overview
  Creates the complete database schema for a local e-commerce platform connecting customers with nearby stores.

  ## New Tables
  
  ### 1. categories
    - `id` (uuid, primary key) - Unique category identifier
    - `name` (text) - Category name (Fashion, Beauty, Kitchen, Healthcare)
    - `icon` (text) - Icon name for UI display
    - `created_at` (timestamptz) - Record creation timestamp
  
  ### 2. stores
    - `id` (uuid, primary key) - Unique store identifier
    - `name` (text) - Store name
    - `location` (text) - Store location/area
    - `address` (text) - Full address
    - `rating` (numeric) - Store rating (0-5)
    - `verified` (boolean) - Verification status
    - `image_url` (text) - Store image URL
    - `created_at` (timestamptz) - Record creation timestamp
  
  ### 3. products
    - `id` (uuid, primary key) - Unique product identifier
    - `name` (text) - Product name
    - `description` (text) - Product description
    - `price` (numeric) - Product price
    - `original_price` (numeric) - Original price (for showing discounts)
    - `category_id` (uuid) - Reference to categories table
    - `store_id` (uuid) - Reference to stores table
    - `images` (jsonb) - Array of image URLs
    - `open_box_delivery` (boolean) - Open box delivery availability
    - `return_policy` (text) - Return/exchange policy
    - `stock` (integer) - Available stock
    - `created_at` (timestamptz) - Record creation timestamp
  
  ### 4. delivery_slots
    - `id` (uuid, primary key) - Unique slot identifier
    - `label` (text) - Slot label (e.g., "10 AM - 1 PM")
    - `start_time` (time) - Slot start time
    - `end_time` (time) - Slot end time
    - `active` (boolean) - Slot availability status
    - `created_at` (timestamptz) - Record creation timestamp
  
  ### 5. orders
    - `id` (uuid, primary key) - Unique order identifier
    - `user_id` (uuid) - Reference to auth.users
    - `product_id` (uuid) - Reference to products table
    - `quantity` (integer) - Order quantity
    - `delivery_slot_id` (uuid) - Reference to delivery_slots table
    - `delivery_address` (text) - Delivery address
    - `payment_method` (text) - Payment method (UPI/COD/Card)
    - `status` (text) - Order status
    - `total_amount` (numeric) - Total order amount
    - `delivery_fee` (numeric) - Delivery charges
    - `created_at` (timestamptz) - Order creation timestamp
  
  ### 6. cart
    - `id` (uuid, primary key) - Unique cart item identifier
    - `user_id` (uuid) - Reference to auth.users
    - `product_id` (uuid) - Reference to products table
    - `quantity` (integer) - Cart item quantity
    - `created_at` (timestamptz) - Record creation timestamp

  ## Security
    - Enable RLS on all tables
    - Add policies for public read access to categories, stores, products, delivery_slots
    - Add policies for authenticated users to manage their own cart and orders
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  address text NOT NULL,
  rating numeric DEFAULT 4.5,
  verified boolean DEFAULT true,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view stores"
  ON stores FOR SELECT
  TO public
  USING (true);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  original_price numeric,
  category_id uuid REFERENCES categories(id),
  store_id uuid REFERENCES stores(id),
  images jsonb DEFAULT '[]'::jsonb,
  open_box_delivery boolean DEFAULT false,
  return_policy text DEFAULT 'Exchange at Store Only',
  stock integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);

-- Create delivery_slots table
CREATE TABLE IF NOT EXISTS delivery_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE delivery_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view delivery slots"
  ON delivery_slots FOR SELECT
  TO public
  USING (true);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  product_id uuid REFERENCES products(id),
  quantity integer DEFAULT 1,
  delivery_slot_id uuid REFERENCES delivery_slots(id),
  delivery_address text NOT NULL,
  payment_method text NOT NULL,
  status text DEFAULT 'pending',
  total_amount numeric NOT NULL,
  delivery_fee numeric DEFAULT 40,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create cart table
CREATE TABLE IF NOT EXISTS cart (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  product_id uuid REFERENCES products(id),
  quantity integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cart ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart"
  ON cart FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cart"
  ON cart FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON cart FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own cart"
  ON cart FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_store ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart(user_id);