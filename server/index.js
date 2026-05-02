const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'replace-this-in-production';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:4200';
const DB_PATH = path.join(__dirname, 'data', 'trendify.db');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const app = express();
let db;

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: false
  })
);
app.use(express.json());

function parseJson(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function mapUser(row) {
  return {
    id: String(row.id),
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    role: row.role,
    createdAt: row.created_at
  };
}

function mapCategory(row) {
  return {
    id: String(row.id),
    name: row.name,
    description: row.description,
    image: row.image,
    createdAt: row.created_at
  };
}

function mapBrand(row) {
  return {
    id: String(row.id),
    name: row.name,
    description: row.description,
    logo: row.logo,
    createdAt: row.created_at
  };
}

function mapProduct(row) {
  return {
    id: String(row.id),
    name: row.name,
    description: row.description,
    price: Number(row.price),
    originalPrice: Number(row.original_price),
    discount: Number(row.discount),
    images: parseJson(row.images, []),
    categoryId: String(row.category_id),
    brandId: String(row.brand_id),
    stock: Number(row.stock),
    rating: Number(row.rating),
    reviews: Number(row.reviews),
    features: parseJson(row.features, []),
    specifications: parseJson(row.specifications, {}),
    createdAt: row.created_at
  };
}

function mapOrderItem(row) {
  return {
    id: String(row.id),
    productId: String(row.product_id),
    quantity: Number(row.quantity),
    price: Number(row.price)
  };
}

async function mapOrder(row) {
  const items = await db.all(
    `SELECT id, product_id, quantity, price
     FROM order_items
     WHERE order_id = ?
     ORDER BY id ASC`,
    row.id
  );

  return {
    id: String(row.id),
    userId: String(row.user_id),
    items: items.map(mapOrderItem),
    total: Number(row.total),
    status: row.status,
    shippingAddress: parseJson(row.shipping_address, {}),
    paymentMethod: row.payment_method,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    customer: row.email
      ? {
          id: String(row.user_id),
          email: row.email,
          firstName: row.first_name,
          lastName: row.last_name
        }
      : undefined
  };
}

function signToken(userRow) {
  return jwt.sign(
    {
      sub: String(userRow.id),
      role: userRow.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.get(
      `SELECT id, email, first_name, last_name, role, created_at
       FROM users
       WHERE id = ?`,
      decoded.sub
    );

    if (!user) {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired authentication token' });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  return next();
}

function validateRegisterPayload(body) {
  if (!body.firstName?.trim()) return 'First name is required';
  if (!body.lastName?.trim()) return 'Last name is required';
  if (!body.email?.trim()) return 'Email is required';
  if (!EMAIL_REGEX.test(body.email.trim())) return 'Please enter a valid email address';
  if (!body.password) return 'Password is required';
  if (!PASSWORD_REGEX.test(body.password)) {
    return 'Password must be at least 8 characters and include at least one letter and one number';
  }

  return null;
}

function validateOrderPayload(body) {
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return 'Order must include at least one item';
  }

  if (!body.shippingAddress) return 'Shipping address is required';

  const requiredAddress = ['street', 'city', 'state', 'zipCode', 'country'];
  const missingAddress = requiredAddress.find((field) => !body.shippingAddress[field]?.toString().trim());
  if (missingAddress) {
    return `Shipping address field ${missingAddress} is required`;
  }

  if (!body.paymentMethod?.toString().trim()) return 'Payment method is required';

  const total = Number(body.total);
  if (!Number.isFinite(total) || total <= 0) return 'Order total must be a positive number';

  return null;
}

async function initializeDatabase() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

  db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  await db.exec('PRAGMA foreign_keys = ON;');

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      image TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      logo TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      price REAL NOT NULL,
      original_price REAL NOT NULL,
      discount INTEGER NOT NULL DEFAULT 0,
      images TEXT NOT NULL,
      category_id INTEGER NOT NULL,
      brand_id INTEGER NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      rating REAL NOT NULL DEFAULT 0,
      reviews INTEGER NOT NULL DEFAULT 0,
      features TEXT NOT NULL,
      specifications TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE RESTRICT,
      FOREIGN KEY(brand_id) REFERENCES brands(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      shipping_address TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE RESTRICT
    );
  `);

  await seedData();
}

async function seedData() {
  const userCount = await db.get('SELECT COUNT(*) AS count FROM users');
  if (userCount.count === 0) {
    const adminHash = await bcrypt.hash('admin123', 10);
    await db.run(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES (?, ?, ?, ?, ?)`,
      'admin@example.com',
      adminHash,
      'Admin',
      'User',
      'admin'
    );
  }

  const categoryCount = await db.get('SELECT COUNT(*) AS count FROM categories');
  if (categoryCount.count === 0) {
    const categories = [
      {
        name: 'Electronics',
        description: 'Latest electronic gadgets and devices',
        image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=500'
      },
      {
        name: 'Fashion',
        description: 'Trendy clothing and accessories',
        image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=500'
      },
      {
        name: 'Home & Garden',
        description: 'Everything for your home and garden',
        image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=500'
      }
    ];

    for (const category of categories) {
      await db.run(
        `INSERT INTO categories (name, description, image) VALUES (?, ?, ?)`,
        category.name,
        category.description,
        category.image
      );
    }
  }

  const brandCount = await db.get('SELECT COUNT(*) AS count FROM brands');
  if (brandCount.count === 0) {
    const brands = [
      {
        name: 'TechPro',
        description: 'Premium technology brand',
        logo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      {
        name: 'StyleMax',
        description: 'Fashion forward clothing',
        logo: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      {
        name: 'HomeComfort',
        description: 'Quality home products',
        logo: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=100'
      }
    ];

    for (const brand of brands) {
      await db.run(
        `INSERT INTO brands (name, description, logo) VALUES (?, ?, ?)`,
        brand.name,
        brand.description,
        brand.logo
      );
    }
  }

  const productCount = await db.get('SELECT COUNT(*) AS count FROM products');
  if (productCount.count === 0) {
    const products = [
      {
        name: 'Wireless Headphones',
        description: 'Premium wireless headphones with noise cancellation',
        price: 299.99,
        originalPrice: 399.99,
        discount: 25,
        images: [
          'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
          'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=500'
        ],
        categoryId: 1,
        brandId: 1,
        stock: 50,
        rating: 4.5,
        reviews: 128,
        features: ['Noise Cancellation', '30-hour battery', 'Quick charge'],
        specifications: {
          batteryLife: '30 hours',
          connectivity: 'Bluetooth 5.0',
          weight: '250g'
        }
      },
      {
        name: 'Smart Watch',
        description: 'Advanced fitness tracking smartwatch',
        price: 199.99,
        originalPrice: 249.99,
        discount: 20,
        images: [
          'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500',
          'https://images.pexels.com/photos/1987841/pexels-photo-1987841.jpeg?auto=compress&cs=tinysrgb&w=500'
        ],
        categoryId: 1,
        brandId: 1,
        stock: 75,
        rating: 4.3,
        reviews: 89,
        features: ['Heart Rate Monitor', 'GPS', 'Water Resistant'],
        specifications: {
          display: '1.4 AMOLED',
          battery: '7 days',
          waterRating: '5ATM'
        }
      },
      {
        name: 'Designer T-Shirt',
        description: 'Premium cotton designer t-shirt',
        price: 49.99,
        originalPrice: 79.99,
        discount: 37,
        images: [
          'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=500',
          'https://images.pexels.com/photos/991509/pexels-photo-991509.jpeg?auto=compress&cs=tinysrgb&w=500'
        ],
        categoryId: 2,
        brandId: 2,
        stock: 100,
        rating: 4.7,
        reviews: 234,
        features: ['100% Cotton', 'Pre-shrunk', 'Eco-friendly'],
        specifications: {
          material: '100% Organic Cotton',
          care: 'Machine wash cold',
          origin: 'Made in USA'
        }
      },
      {
        name: 'Coffee Maker',
        description: 'Professional grade coffee maker',
        price: 149.99,
        originalPrice: 199.99,
        discount: 25,
        images: [
          'https://images.pexels.com/photos/6508358/pexels-photo-6508358.jpeg?auto=compress&cs=tinysrgb&w=500',
          'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=500'
        ],
        categoryId: 3,
        brandId: 3,
        stock: 25,
        rating: 4.6,
        reviews: 156,
        features: ['12-cup capacity', 'Programmable', 'Auto-shutoff'],
        specifications: {
          capacity: '12 cups',
          power: '1200W',
          dimensions: '12 x 8 x 10 in'
        }
      }
    ];

    for (const product of products) {
      await db.run(
        `INSERT INTO products
        (name, description, price, original_price, discount, images, category_id, brand_id, stock, rating, reviews, features, specifications)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        product.name,
        product.description,
        product.price,
        product.originalPrice,
        product.discount,
        JSON.stringify(product.images),
        product.categoryId,
        product.brandId,
        product.stock,
        product.rating,
        product.reviews,
        JSON.stringify(product.features),
        JSON.stringify(product.specifications)
      );
    }
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/register', async (req, res, next) => {
  try {
    const validationError = validateRegisterPayload(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const email = req.body.email.trim().toLowerCase();

    const existing = await db.get('SELECT id FROM users WHERE email = ?', email);
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const insertResult = await db.run(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES (?, ?, ?, ?, 'user')`,
      email,
      passwordHash,
      firstName,
      lastName
    );

    const userRow = await db.get(
      `SELECT id, email, first_name, last_name, role, created_at
       FROM users
       WHERE id = ?`,
      insertResult.lastID
    );

    const token = signToken(userRow);
    return res.status(201).json({
      user: mapUser(userRow),
      token
    });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const userRow = await db.get(
      `SELECT id, email, password_hash, first_name, last_name, role, created_at
       FROM users
       WHERE email = ?`,
      email
    );

    if (!userRow) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, userRow.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(userRow);

    return res.json({
      user: mapUser(userRow),
      token
    });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  return res.json({ user: mapUser(req.user) });
});

app.get('/api/categories', async (_req, res, next) => {
  try {
    const categories = await db.all(
      'SELECT id, name, description, image, created_at FROM categories ORDER BY id ASC'
    );
    return res.json(categories.map(mapCategory));
  } catch (error) {
    return next(error);
  }
});

app.post('/api/categories', authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const name = req.body.name?.toString().trim();
    const description = req.body.description?.toString().trim() || '';
    const image = req.body.image?.toString().trim() || '';

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const result = await db.run(
      `INSERT INTO categories (name, description, image) VALUES (?, ?, ?)`,
      name,
      description,
      image
    );

    const category = await db.get(
      'SELECT id, name, description, image, created_at FROM categories WHERE id = ?',
      result.lastID
    );

    return res.status(201).json(mapCategory(category));
  } catch (error) {
    return next(error);
  }
});

app.put('/api/categories/:id', authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const name = req.body.name?.toString().trim();
    const description = req.body.description?.toString().trim() || '';
    const image = req.body.image?.toString().trim() || '';

    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: 'Invalid category id' });
    }

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    await db.run(
      `UPDATE categories SET name = ?, description = ?, image = ? WHERE id = ?`,
      name,
      description,
      image,
      id
    );

    const category = await db.get(
      'SELECT id, name, description, image, created_at FROM categories WHERE id = ?',
      id
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.json(mapCategory(category));
  } catch (error) {
    return next(error);
  }
});

app.delete('/api/categories/:id', authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: 'Invalid category id' });
    }

    const result = await db.run('DELETE FROM categories WHERE id = ?', id);
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

app.get('/api/brands', async (_req, res, next) => {
  try {
    const brands = await db.all(
      'SELECT id, name, description, logo, created_at FROM brands ORDER BY id ASC'
    );
    return res.json(brands.map(mapBrand));
  } catch (error) {
    return next(error);
  }
});

app.post('/api/brands', authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const name = req.body.name?.toString().trim();
    const description = req.body.description?.toString().trim() || '';
    const logo = req.body.logo?.toString().trim() || '';

    if (!name) {
      return res.status(400).json({ message: 'Brand name is required' });
    }

    const result = await db.run(
      `INSERT INTO brands (name, description, logo) VALUES (?, ?, ?)`,
      name,
      description,
      logo
    );

    const brand = await db.get(
      'SELECT id, name, description, logo, created_at FROM brands WHERE id = ?',
      result.lastID
    );

    return res.status(201).json(mapBrand(brand));
  } catch (error) {
    return next(error);
  }
});

app.put('/api/brands/:id', authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const name = req.body.name?.toString().trim();
    const description = req.body.description?.toString().trim() || '';
    const logo = req.body.logo?.toString().trim() || '';

    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: 'Invalid brand id' });
    }

    if (!name) {
      return res.status(400).json({ message: 'Brand name is required' });
    }

    await db.run(
      `UPDATE brands SET name = ?, description = ?, logo = ? WHERE id = ?`,
      name,
      description,
      logo,
      id
    );

    const brand = await db.get(
      'SELECT id, name, description, logo, created_at FROM brands WHERE id = ?',
      id
    );

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    return res.json(mapBrand(brand));
  } catch (error) {
    return next(error);
  }
});

app.delete('/api/brands/:id', authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: 'Invalid brand id' });
    }

    const result = await db.run('DELETE FROM brands WHERE id = ?', id);
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

app.get('/api/products', async (_req, res, next) => {
  try {
    const products = await db.all(
      `SELECT id, name, description, price, original_price, discount, images, category_id, brand_id,
              stock, rating, reviews, features, specifications, created_at
       FROM products
       ORDER BY id ASC`
    );

    return res.json(products.map(mapProduct));
  } catch (error) {
    return next(error);
  }
});

app.post('/api/products', authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const payload = req.body;
    const name = payload.name?.toString().trim();

    if (!name) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    const requiredNumeric = ['price', 'originalPrice', 'stock', 'rating', 'reviews'];
    for (const field of requiredNumeric) {
      if (!Number.isFinite(Number(payload[field]))) {
        return res.status(400).json({ message: `Invalid ${field}` });
      }
    }

    if (!Number.isFinite(Number(payload.categoryId)) || !Number.isFinite(Number(payload.brandId))) {
      return res.status(400).json({ message: 'Valid category and brand are required' });
    }

    const result = await db.run(
      `INSERT INTO products
      (name, description, price, original_price, discount, images, category_id, brand_id, stock, rating, reviews, features, specifications)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      name,
      payload.description?.toString().trim() || '',
      Number(payload.price),
      Number(payload.originalPrice),
      Number(payload.discount) || 0,
      JSON.stringify(Array.isArray(payload.images) ? payload.images : []),
      Number(payload.categoryId),
      Number(payload.brandId),
      Number(payload.stock),
      Number(payload.rating),
      Number(payload.reviews),
      JSON.stringify(Array.isArray(payload.features) ? payload.features : []),
      JSON.stringify(payload.specifications || {})
    );

    const row = await db.get(
      `SELECT id, name, description, price, original_price, discount, images, category_id, brand_id,
              stock, rating, reviews, features, specifications, created_at
       FROM products WHERE id = ?`,
      result.lastID
    );

    return res.status(201).json(mapProduct(row));
  } catch (error) {
    return next(error);
  }
});

app.put('/api/products/:id', authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const payload = req.body;
    const name = payload.name?.toString().trim();

    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    if (!name) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    await db.run(
      `UPDATE products
       SET name = ?, description = ?, price = ?, original_price = ?, discount = ?, images = ?, category_id = ?,
           brand_id = ?, stock = ?, rating = ?, reviews = ?, features = ?, specifications = ?
       WHERE id = ?`,
      name,
      payload.description?.toString().trim() || '',
      Number(payload.price),
      Number(payload.originalPrice),
      Number(payload.discount) || 0,
      JSON.stringify(Array.isArray(payload.images) ? payload.images : []),
      Number(payload.categoryId),
      Number(payload.brandId),
      Number(payload.stock),
      Number(payload.rating),
      Number(payload.reviews),
      JSON.stringify(Array.isArray(payload.features) ? payload.features : []),
      JSON.stringify(payload.specifications || {}),
      id
    );

    const row = await db.get(
      `SELECT id, name, description, price, original_price, discount, images, category_id, brand_id,
              stock, rating, reviews, features, specifications, created_at
       FROM products WHERE id = ?`,
      id
    );

    if (!row) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(mapProduct(row));
  } catch (error) {
    return next(error);
  }
});

app.delete('/api/products/:id', authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const result = await db.run('DELETE FROM products WHERE id = ?', id);
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

app.post('/api/orders', authMiddleware, async (req, res, next) => {
  const validationError = validateOrderPayload(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    await db.run('BEGIN TRANSACTION');

    const result = await db.run(
      `INSERT INTO orders (user_id, total, status, shipping_address, payment_method)
       VALUES (?, ?, 'pending', ?, ?)`,
      req.user.id,
      Number(req.body.total),
      JSON.stringify(req.body.shippingAddress),
      req.body.paymentMethod.toString().trim()
    );

    for (const item of req.body.items) {
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);
      const price = Number(item.price);

      if (!Number.isFinite(productId) || !Number.isFinite(quantity) || !Number.isFinite(price)) {
        throw new Error('Order contains invalid item data');
      }

      await db.run(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        result.lastID,
        productId,
        quantity,
        price
      );
    }

    await db.run('COMMIT');

    const orderRow = await db.get(
      `SELECT id, user_id, total, status, shipping_address, payment_method, created_at, updated_at
       FROM orders WHERE id = ?`,
      result.lastID
    );

    const order = await mapOrder(orderRow);
    return res.status(201).json(order);
  } catch (error) {
    await db.run('ROLLBACK');
    return next(error);
  }
});

app.get('/api/orders/my', authMiddleware, async (req, res, next) => {
  try {
    const rows = await db.all(
      `SELECT id, user_id, total, status, shipping_address, payment_method, created_at, updated_at
       FROM orders
       WHERE user_id = ?
       ORDER BY datetime(created_at) DESC`,
      req.user.id
    );

    const orders = [];
    for (const row of rows) {
      orders.push(await mapOrder(row));
    }

    return res.json(orders);
  } catch (error) {
    return next(error);
  }
});

app.get('/api/admin/orders', authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const rows = await db.all(
      `SELECT o.id, o.user_id, o.total, o.status, o.shipping_address, o.payment_method, o.created_at, o.updated_at,
              u.email, u.first_name, u.last_name
       FROM orders o
       INNER JOIN users u ON u.id = o.user_id
       ORDER BY datetime(o.created_at) DESC`
    );

    const orders = [];
    for (const row of rows) {
      orders.push(await mapOrder(row));
    }

    return res.json(orders);
  } catch (error) {
    return next(error);
  }
});

app.use((error, _req, res, _next) => {
  if (error && error.message && error.message.includes('FOREIGN KEY constraint failed')) {
    return res.status(400).json({ message: 'Invalid reference data in request' });
  }

  console.error(error);
  return res.status(500).json({ message: 'Internal server error' });
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database', error);
    process.exit(1);
  });