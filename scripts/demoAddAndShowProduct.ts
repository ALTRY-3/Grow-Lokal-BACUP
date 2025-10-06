/**
 * Demo: Add a product and show details for presentation
 *
 * - Finds an approved seller (or creates a demo seller if none exists)
 * - Creates a demo product owned by that seller
 * - Reads it back and prints a clean summary + suggested URLs to view in the app
 *
 * Run:
 *   npm run demo:add-product
 * (Requires .env.local with MONGODB_URI configured)
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local before other imports
const envPath = path.resolve(process.cwd(), '.env.local')
dotenv.config({ path: envPath })

import mongoose from 'mongoose'
// Keep extension to mirror existing seeding style for tsx
import connectDB from '../src/lib/mongodb.js'
import User from '../src/models/User.js'
import Product from '../src/models/Product.js'

function generateSku(prefix = 'DEM'): string {
  const timestamp = Date.now().toString().slice(-6)
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${rand}`.toUpperCase()
}

async function getOrCreateApprovedSeller() {
  // Find an approved seller first
  const existing = await (User as any).findOne({ 'sellerProfile.applicationStatus': 'approved' })
  if (existing) return existing

  // Create a demo seller if none exists
  const email = `demo-seller+${Date.now()}@example.com`
  const demo = await (User as any).create({
    name: 'Demo Seller',
    email,
    password: 'Demo@1234',
    provider: 'email',
    emailVerified: true,
    isSeller: true,
    sellerProfile: {
      shopName: 'Demo Shop',
      applicationStatus: 'approved',
      approvedAt: new Date(),
    },
  })
  return demo
}

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error('ERROR: MONGODB_URI not set. Create a .env.local with MONGODB_URI.')
    process.exit(1)
  }

  await connectDB()

  try {
    const seller = await getOrCreateApprovedSeller()

    const demoName = `Demo Handcrafted Bowl ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`
    const images = ['/box1.png', '/box1.1.png']

    // Create product (ensure thumbnailUrl + sku present to satisfy schema)
    const created = await (Product as any).create({
      name: demoName,
      description: 'A handcrafted acacia wood bowl perfect for presentations and demos.',
      shortDescription: 'Beautiful acacia bowl for demo',
      category: 'handicrafts',
      price: 499.0,
      stock: 10,
      currency: 'PHP',
      images,
      thumbnailUrl: images[0],
      sku: generateSku('DEM'),
      artistId: seller._id,
      artistName: seller?.sellerProfile?.shopName || seller.name || 'Demo Seller',
      tags: ['demo', 'handcrafted', 'bowl'],
      isActive: true,
      isAvailable: true,
    })

    // Read it back to confirm
    const found = await (Product as any).findById(created._id).lean()

    // Pretty print summary
    console.log('\n=== Demo Product Created ===')
    console.log('ID       :', created._id.toString())
    console.log('Name     :', created.name)
    console.log('SKU      :', created.sku)
    console.log('Category :', created.category)
    console.log('Price    : ₱' + created.price.toFixed(2))
    console.log('Stock    :', created.stock)
    console.log('Seller   :', created.artistName, `(${seller.email})`)
    console.log('Images   :', created.images)

    console.log('\n=== How to present it in the app ===')
    console.log('- Start the dev server: npm run dev')
    console.log('- As the demo seller or any approved seller, visit: /product (My Products)')
    console.log(`- Or show it on marketplace search: /marketplace?query=${encodeURIComponent(created.name)}`)
    console.log('- You can also open Add Product page for editing: /add-product?edit=' + created._id.toString())

    console.log('\nVerification snapshot:')
    console.log({
      existsAfterCreate: !!found,
      displayPrice: `₱${created.price.toFixed(2)}`,
      isActive: created.isActive,
      isAvailable: created.isAvailable,
    })
  } catch (err) {
    console.error('Demo failed:', err)
    process.exitCode = 1
  } finally {
    await mongoose.connection.close()
  }
}

run()
