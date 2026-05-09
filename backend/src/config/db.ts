import "dotenv/config";
import bcrypt from "bcryptjs";
import postgres from "postgres";

function getEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function requireEnv(name: string): string {
  const value = getEnv(name);
  if (!value) {
    throw new Error(`${name} is required in backend/.env`);
  }
  return value;
}

const databaseUrl = getEnv("NEON_DATABASE_URL") || getEnv("DATABASE_URL");

if (!databaseUrl) {
  throw new Error("NEON_DATABASE_URL or DATABASE_URL is required in backend/.env");
}

export const sql = postgres(databaseUrl, {
  ssl: "require",
  max: 10,
  idle_timeout: 20,
  connect_timeout: 15,
});

type SeedProduct = {
  title: string;
  slug: string;
  category: string;
  brand: string;
  features: string[];
  condition: "new" | "refurbished" | "used";
  verified: boolean;
  image: string;
  images: string[];
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  orders: number;
  sold: number;
  freeShipping: boolean;
  shortDescription: string;
  description: string;
  specs: Record<string, string>;
};

const seedProducts: SeedProduct[] = [
  {
    title: "Smart Watch Series 5 - Silver",
    slug: "smart-watch-series-5-silver",
    category: "Mobile accessory",
    brand: "Apple",
    features: ["Metallic", "GPS", "Fitness"],
    condition: "new",
    verified: true,
    image: "/images/products/Smartwatch.png",
    images: ["/images/products/Smartwatch.png"],
    price: 99.5,
    originalPrice: 128,
    rating: 4.2,
    reviewCount: 32,
    orders: 154,
    sold: 154,
    freeShipping: true,
    shortDescription: "Advanced fitness smartwatch with GPS and heart-rate tracking.",
    description: "A dependable everyday smartwatch with multi-day battery life, workout tracking, GPS, and durable aluminum construction.",
    specs: { Model: "SW-5S-2024", Style: "Modern Sport", Certificate: "CE, FCC", Size: "44mm case", Memory: "32GB Storage" },
  },
  {
    title: "iPhone 13 Pro Max - Blue",
    slug: "iphone-13-pro-max-blue",
    category: "Smartphones",
    brand: "Apple",
    features: ["Large Memory", "Metallic", "5G"],
    condition: "new",
    verified: true,
    image: "/images/products/blue_iphone.png",
    images: ["/images/products/blue_iphone.png"],
    price: 899,
    originalPrice: 999,
    rating: 4.8,
    reviewCount: 432,
    orders: 432,
    sold: 892,
    freeShipping: true,
    shortDescription: "Flagship iPhone with a large display and pro camera system.",
    description: "A premium smartphone with smooth performance, vibrant display, long battery life, and excellent cameras for everyday creators.",
    specs: { Model: "A2643", Style: "Premium", Certificate: "Apple Certified", Size: "160.8 x 78.1 x 7.65 mm", Memory: "256GB" },
  },
  {
    title: "GoPro HERO10 4K Action Camera",
    slug: "gopro-hero10-4k-action-camera",
    category: "Electronics",
    brand: "GoPro",
    features: ["Super power", "Waterproof", "4K"],
    condition: "new",
    verified: true,
    image: "/images/products/Gorpro.png",
    images: ["/images/products/Gorpro.png"],
    price: 349.99,
    originalPrice: 399.99,
    rating: 4.5,
    reviewCount: 210,
    orders: 210,
    sold: 456,
    freeShipping: true,
    shortDescription: "Compact action camera for travel, sports, and outdoor capture.",
    description: "Capture stabilized high-resolution video and crisp photos in a lightweight waterproof action camera built for adventure.",
    specs: { Model: "CHDHX-101", Style: "Action Cam", Certificate: "IP68", Size: "71 x 55 x 33.6 mm", Memory: "SD Card up to 1TB" },
  },
  {
    title: "Sony Wireless Headphones",
    slug: "sony-wireless-headphones",
    category: "Electronics",
    brand: "Sony",
    features: ["Large Memory", "Bluetooth", "Noise Canceling"],
    condition: "new",
    verified: false,
    image: "/images/products/headphones.png",
    images: ["/images/products/headphones.png"],
    price: 149,
    originalPrice: 199,
    rating: 4.1,
    reviewCount: 102,
    orders: 198,
    sold: 198,
    freeShipping: true,
    shortDescription: "Wireless over-ear headphones with strong battery life.",
    description: "Comfortable wireless headphones with balanced sound, soft earcups, and reliable everyday battery performance.",
    specs: { Model: "WH-XB910N", Style: "Over-ear", Certificate: "CE", Size: "One size", Memory: "N/A" },
  },
  {
    title: "MacBook Pro M2 - Space Gray",
    slug: "macbook-pro-m2-space-gray",
    category: "Modern tech",
    brand: "Apple",
    features: ["Large Memory", "8GB Ram", "Metallic"],
    condition: "new",
    verified: true,
    image: "/images/products/Laptop.png",
    images: ["/images/products/Laptop.png"],
    price: 1299,
    originalPrice: 1499,
    rating: 4.9,
    reviewCount: 89,
    orders: 89,
    sold: 89,
    freeShipping: false,
    shortDescription: "High-performance laptop for work, editing, and travel.",
    description: "A lightweight premium laptop with strong battery life, excellent screen quality, and fast day-to-day performance.",
    specs: { Model: "MNEH3", Style: "Pro", Certificate: "Energy Star", Size: "13-inch", Memory: "8GB RAM / 512GB SSD" },
  },
  {
    title: "iPhone 14 Pro - Deep Purple",
    slug: "iphone-14-pro-deep-purple",
    category: "Smartphones",
    brand: "Apple",
    features: ["Large Memory", "5G", "Metallic"],
    condition: "refurbished",
    verified: true,
    image: "/images/products/red_iphone.png",
    images: ["/images/products/red_iphone.png"],
    price: 999,
    originalPrice: 1099,
    rating: 4.7,
    reviewCount: 267,
    orders: 267,
    sold: 267,
    freeShipping: true,
    shortDescription: "A premium refurbished iPhone with flagship performance.",
    description: "Professionally refurbished flagship smartphone with excellent camera quality, bright display, and premium build.",
    specs: { Model: "A2890", Style: "Premium", Certificate: "Refurbished Grade A", Size: "6.1-inch", Memory: "256GB" },
  },
  {
    title: "Men's Casual T-Shirt Blue",
    slug: "mens-casual-t-shirt-blue",
    category: "Clothes and wear",
    brand: "Pocco",
    features: ["Plastic cover", "Breathable", "Everyday"],
    condition: "new",
    verified: false,
    image: "/images/products/bluetshirt.png",
    images: ["/images/products/bluetshirt.png"],
    price: 24.99,
    originalPrice: 35,
    rating: 3.9,
    reviewCount: 87,
    orders: 543,
    sold: 543,
    freeShipping: false,
    shortDescription: "Soft casual tee for daily wear.",
    description: "A lightweight, comfortable t-shirt designed for everyday wear with a relaxed fit and durable stitching.",
    specs: { Model: "TS-BLU-01", Style: "Casual", Certificate: "OEKO-TEX", Size: "M / L / XL", Memory: "N/A" },
  },
  {
    title: "Winter Coat Premium - Black",
    slug: "winter-coat-premium-black",
    category: "Clothes and wear",
    brand: "Lenovo",
    features: ["Super power", "Warm", "Metallic"],
    condition: "new",
    verified: true,
    image: "/images/products/coat.png",
    images: ["/images/products/coat.png"],
    price: 149.5,
    originalPrice: 199,
    rating: 4.3,
    reviewCount: 124,
    orders: 124,
    sold: 124,
    freeShipping: true,
    shortDescription: "Heavyweight winter coat with a clean silhouette.",
    description: "A premium insulated coat with a structured fit, practical pockets, and dependable cold-weather warmth.",
    specs: { Model: "CT-BLK-03", Style: "Outerwear", Certificate: "ISO-Textile", Size: "S / M / L", Memory: "N/A" },
  },
  {
    title: "Travel Backpack",
    slug: "travel-backpack",
    category: "Mobile accessory",
    brand: "Samsung",
    features: ["Large Memory", "Travel", "Water-resistant"],
    condition: "new",
    verified: false,
    image: "/images/products/backpack.png",
    images: ["/images/products/backpack.png"],
    price: 99,
    originalPrice: 129,
    rating: 4,
    reviewCount: 63,
    orders: 143,
    sold: 143,
    freeShipping: false,
    shortDescription: "Organized backpack for commuting and travel.",
    description: "A structured backpack with multiple compartments, travel-friendly capacity, and durable fabric.",
    specs: { Model: "BP-TR-02", Style: "Travel", Certificate: "CE", Size: "30L", Memory: "N/A" },
  },
  {
    title: "Leather Wallet",
    slug: "leather-wallet",
    category: "Mobile accessory",
    brand: "Huawei",
    features: ["Metallic", "Compact"],
    condition: "new",
    verified: true,
    image: "/images/products/wallet.png",
    images: ["/images/products/wallet.png"],
    price: 34,
    originalPrice: 42,
    rating: 4.1,
    reviewCount: 40,
    orders: 88,
    sold: 88,
    freeShipping: true,
    shortDescription: "Compact wallet with premium leather finish.",
    description: "A neat everyday wallet with multiple card slots, a slim profile, and durable stitched leather.",
    specs: { Model: "WL-LTHR", Style: "Classic", Certificate: "N/A", Size: "Bi-fold", Memory: "N/A" },
  },
  {
    title: "Gaming Headset",
    slug: "gaming-headset-white",
    category: "Electronics",
    brand: "Samsung",
    features: ["8GB Ram", "Surround", "Plastic cover"],
    condition: "new",
    verified: true,
    image: "/images/products/white headset.png",
    images: ["/images/products/white headset.png"],
    price: 89,
    originalPrice: 109,
    rating: 3.8,
    reviewCount: 52,
    orders: 97,
    sold: 97,
    freeShipping: true,
    shortDescription: "Comfortable gaming headset with clear voice pickup.",
    description: "An affordable gaming headset with lightweight build, balanced sound, and an adjustable microphone boom.",
    specs: { Model: "GH-WHT", Style: "Gaming", Certificate: "CE", Size: "Adjustable", Memory: "N/A" },
  },
  {
    title: "Electric Kettle",
    slug: "electric-kettle-black",
    category: "Home interiors",
    brand: "Pocco",
    features: ["Super power", "Kitchen", "Plastic cover"],
    condition: "new",
    verified: false,
    image: "/images/products/black_cup.png",
    images: ["/images/products/black_cup.png"],
    price: 80.95,
    originalPrice: 90,
    rating: 4,
    reviewCount: 19,
    orders: 36,
    sold: 36,
    freeShipping: false,
    shortDescription: "Fast-boil kettle with compact countertop footprint.",
    description: "A practical electric kettle with easy-pour spout, auto shutoff, and quick heating performance.",
    specs: { Model: "KT-BLK", Style: "Kitchen", Certificate: "CE", Size: "1.7L", Memory: "N/A" },
  },
  {
    title: "Soft Chair",
    slug: "soft-chair-white",
    category: "Home interiors",
    brand: "Lenovo",
    features: ["Modern", "Comfort"],
    condition: "new",
    verified: true,
    image: "/images/products/white_chair.png",
    images: ["/images/products/white_chair.png"],
    price: 119,
    originalPrice: 149,
    rating: 4.4,
    reviewCount: 18,
    orders: 24,
    sold: 24,
    freeShipping: false,
    shortDescription: "Soft accent chair for living rooms and reading corners.",
    description: "A compact accent chair with supportive cushioning and a modern neutral finish that suits many interiors.",
    specs: { Model: "CHR-WHT", Style: "Modern", Certificate: "ISO-Furniture", Size: "Single seat", Memory: "N/A" },
  },
  {
    title: "Coffee Machine Blender",
    slug: "blender-coffee-machine",
    category: "Home interiors",
    brand: "Huawei",
    features: ["Kitchen", "Super power"],
    condition: "refurbished",
    verified: true,
    image: "/images/products/whitecoffemachine.png",
    images: ["/images/products/whitecoffemachine.png"],
    price: 240,
    originalPrice: 280,
    rating: 4.1,
    reviewCount: 14,
    orders: 18,
    sold: 18,
    freeShipping: false,
    shortDescription: "Countertop coffee and blending appliance for small kitchens.",
    description: "A refurbished countertop appliance suited for compact kitchens and quick morning beverage prep.",
    specs: { Model: "CM-BLND", Style: "Kitchen", Certificate: "Refurbished Grade A", Size: "Countertop", Memory: "N/A" },
  },
  {
    title: "Decorative Plant Pot",
    slug: "decorative-plant-pot",
    category: "Home interiors",
    brand: "Pocco",
    features: ["Home decor", "Plant", "Modern"],
    condition: "new",
    verified: true,
    image: "/images/products/plante.png",
    images: ["/images/products/plante.png", "/images/products/brown_pot.png"],
    price: 59,
    originalPrice: 79,
    rating: 4.3,
    reviewCount: 41,
    orders: 94,
    sold: 94,
    freeShipping: false,
    shortDescription: "Minimal decorative indoor plant set for tables and shelves.",
    description: "A stylish indoor plant decoration set that adds warmth and texture to living rooms, bedrooms, and office spaces.",
    specs: { Model: "PLNT-SET-01", Style: "Modern", Certificate: "N/A", Size: "Medium", Memory: "N/A" },
  },
  {
    title: "Modern Table Lamp",
    slug: "modern-table-lamp",
    category: "Home interiors",
    brand: "Lenovo",
    features: ["Lighting", "Modern", "Bedroom"],
    condition: "new",
    verified: true,
    image: "/images/products/lamp.png",
    images: ["/images/products/lamp.png"],
    price: 49,
    originalPrice: 65,
    rating: 4.2,
    reviewCount: 35,
    orders: 71,
    sold: 71,
    freeShipping: false,
    shortDescription: "Compact bedside lamp with warm ambient light.",
    description: "A modern table lamp designed for bedrooms and study tables, offering soft light and a clean minimalist silhouette.",
    specs: { Model: "LMP-MDN-02", Style: "Minimal", Certificate: "CE", Size: "Tabletop", Memory: "N/A" },
  },
  {
    title: "Yellow Accent Chair",
    slug: "yellow-accent-chair",
    category: "Home interiors",
    brand: "Huawei",
    features: ["Chair", "Comfort", "Living room"],
    condition: "new",
    verified: true,
    image: "/images/products/yellow_chair.png",
    images: ["/images/products/yellow_chair.png"],
    price: 139,
    originalPrice: 169,
    rating: 4.4,
    reviewCount: 28,
    orders: 53,
    sold: 53,
    freeShipping: false,
    shortDescription: "Comfortable accent chair with modern curved profile.",
    description: "A bold yellow accent chair that works well in living rooms and lounges with supportive seating and contemporary styling.",
    specs: { Model: "CHR-YLW-01", Style: "Contemporary", Certificate: "ISO-Furniture", Size: "Single seat", Memory: "N/A" },
  },
  {
    title: "Fruit Juicer Machine",
    slug: "fruit-juicer-machine",
    category: "Home interiors",
    brand: "Pocco",
    features: ["Kitchen", "Juicer", "Appliance"],
    condition: "new",
    verified: false,
    image: "/images/products/fruite_juicer.png",
    images: ["/images/products/fruite_juicer.png"],
    price: 129,
    originalPrice: 149,
    rating: 4.0,
    reviewCount: 22,
    orders: 38,
    sold: 38,
    freeShipping: false,
    shortDescription: "Countertop juicer for daily fresh fruit drinks.",
    description: "A practical home juicer appliance built for daily use with easy cleaning and consistent juice extraction.",
    specs: { Model: "JCR-PRM-01", Style: "Kitchen", Certificate: "CE", Size: "Countertop", Memory: "N/A" },
  },
  {
    title: "Front Load Washing Machine",
    slug: "front-load-washing-machine",
    category: "Home interiors",
    brand: "Samsung",
    features: ["Home appliance", "Washer", "Energy saving"],
    condition: "new",
    verified: true,
    image: "/images/products/washingmachine.png",
    images: ["/images/products/washingmachine.png"],
    price: 499,
    originalPrice: 579,
    rating: 4.5,
    reviewCount: 64,
    orders: 46,
    sold: 46,
    freeShipping: true,
    shortDescription: "Efficient front-load washer for medium households.",
    description: "A reliable front-load washing machine with energy-efficient cycles, quiet operation, and family-sized drum capacity.",
    specs: { Model: "WM-FL-08", Style: "Appliance", Certificate: "Energy Star", Size: "8kg", Memory: "N/A" },
  },
];

export async function connectDB() {
  await sql`SELECT 1`;
  console.log("✅ Connected to Neon PostgreSQL");
}

export async function initializeSchemaAndSeed() {
  await sql`
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      is_admin BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id BIGSERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      brand TEXT NOT NULL,
      features JSONB NOT NULL DEFAULT '[]'::jsonb,
      condition TEXT NOT NULL CHECK (condition IN ('new', 'refurbished', 'used')),
      verified BOOLEAN NOT NULL DEFAULT FALSE,
      image TEXT NOT NULL,
      images JSONB NOT NULL DEFAULT '[]'::jsonb,
      price NUMERIC(12,2) NOT NULL,
      original_price NUMERIC(12,2),
      rating NUMERIC(3,2) NOT NULL DEFAULT 0,
      review_count INTEGER NOT NULL DEFAULT 0,
      orders INTEGER NOT NULL DEFAULT 0,
      sold INTEGER NOT NULL DEFAULT 0,
      free_shipping BOOLEAN NOT NULL DEFAULT FALSE,
      short_description TEXT NOT NULL,
      description TEXT NOT NULL,
      specs JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS carts (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS cart_items (
      cart_id BIGINT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
      product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (cart_id, product_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'placed',
      subtotal NUMERIC(12,2) NOT NULL,
      discount NUMERIC(12,2) NOT NULL DEFAULT 0,
      tax NUMERIC(12,2) NOT NULL DEFAULT 0,
      total NUMERIC(12,2) NOT NULL,
      item_count INTEGER NOT NULL DEFAULT 0,
      coupon_code TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS order_items (
      id BIGSERIAL PRIMARY KEY,
      order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
      title_snapshot TEXT NOT NULL,
      image_snapshot TEXT NOT NULL,
      unit_price NUMERIC(12,2) NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      line_total NUMERIC(12,2) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      consumed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_products_price ON products(price)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at)`;

  if (process.env.ENABLE_DEMO_SEED !== "true") {
    return;
  }

  const existingSeedMarker = await sql<{ key: string }[]>`
    SELECT key
    FROM app_meta
    WHERE key = 'demo_seed_v1_completed'
    LIMIT 1
  `;
  if (existingSeedMarker.length > 0) {
    return;
  }

  const adminEmail = requireEnv("SEED_ADMIN_EMAIL");
  const adminPassword = requireEnv("SEED_ADMIN_PASSWORD");
  if (adminPassword === "Admin@12345") {
    throw new Error("SEED_ADMIN_PASSWORD must not use the insecure default value");
  }
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await sql`
    INSERT INTO users (name, email, password_hash, is_admin)
    VALUES ('Demo Admin', ${adminEmail}, ${hashedPassword}, TRUE)
    ON CONFLICT (email) DO NOTHING
  `;

  for (const product of seedProducts) {
    await sql`
      INSERT INTO products (
        title, slug, category, brand, features, condition, verified, image, images,
        price, original_price, rating, review_count, orders, sold, free_shipping,
        short_description, description, specs
      ) VALUES (
        ${product.title},
        ${product.slug},
        ${product.category},
        ${product.brand},
        ${JSON.stringify(product.features)}::jsonb,
        ${product.condition},
        ${product.verified},
        ${product.image},
        ${JSON.stringify(product.images)}::jsonb,
        ${product.price},
        ${product.originalPrice ?? null},
        ${product.rating},
        ${product.reviewCount},
        ${product.orders},
        ${product.sold},
        ${product.freeShipping},
        ${product.shortDescription},
        ${product.description},
        ${JSON.stringify(product.specs)}::jsonb
      )
      ON CONFLICT (slug) DO NOTHING
    `;
  }

  await sql`
    INSERT INTO app_meta (key, value)
    VALUES (
      'demo_seed_v1_completed',
      ${JSON.stringify({ seededAt: new Date().toISOString() })}::jsonb
    )
    ON CONFLICT (key) DO NOTHING
  `;
}

export default connectDB;
