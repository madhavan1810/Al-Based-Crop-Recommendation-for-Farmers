
import { db } from '@/lib/db';

type CropPrice = {
  name: string;
  price: number;
  change: number;
};

type SeedPrice = {
  name: string;
  variety: string;
  price: number;
};

async function createTables() {
    const client = await db.connect();
    try {
        await client.query(`
      CREATE TABLE IF NOT EXISTS crop_prices (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        price REAL NOT NULL,
        change REAL NOT NULL
      );
    `);

        await client.query(`
      CREATE TABLE IF NOT EXISTS seed_prices (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        variety VARCHAR(255) NOT NULL,
        price REAL NOT NULL,
        UNIQUE(name, variety)
      );
    `);
    } finally {
        client.release();
    }
}

// Call createTables on service load to ensure they exist.
createTables().catch(console.error);


export async function updateCropPrices(prices: CropPrice[]): Promise<void> {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    
    // Clear existing data
    await client.query('TRUNCATE TABLE crop_prices RESTART IDENTITY');

    // Insert new data
    for (const price of prices) {
      await client.query(
        'INSERT INTO crop_prices (name, price, change) VALUES ($1, $2, $3)',
        [price.name, price.price, price.change]
      );
    }
    
    await client.query('COMMIT');
    console.log('Crop prices updated in PostgreSQL.');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error updating crop prices in PostgreSQL:', e);
    throw e;
  } finally {
    client.release();
  }
}

export async function updateSeedPrices(prices: SeedPrice[]): Promise<void> {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    
    // Clear existing data
    await client.query('TRUNCATE TABLE seed_prices RESTART IDENTITY');

    // Insert new data
    for (const price of prices) {
      await client.query(
        'INSERT INTO seed_prices (name, variety, price) VALUES ($1, $2, $3)',
        [price.name, price.variety, price.price]
      );
    }

    await client.query('COMMIT');
    console.log('Seed prices updated in PostgreSQL.');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error updating seed prices in PostgreSQL:', e);
    throw e;
  } finally {
    client.release();
  }
}

export async function getCropPrices() {
  const client = await db.connect();
  try {
    const res = await client.query('SELECT name, price, change FROM crop_prices');
    return res.rows;
  } catch (e) {
    console.error('Error fetching crop prices from PostgreSQL', e);
    throw e;
  } finally {
    client.release();
  }
}

export async function getSeedPrices() {
  const client = await db.connect();
  try {
    const res = await client.query('SELECT name, variety, price FROM seed_prices');
    return res.rows;
  } catch (e) {
    console.error('Error fetching seed prices from PostgreSQL', e);
    throw e;
  } finally {
    client.release();
  }
}
