/**
 * CRUD Test: Product primary data
 *
 * Exercises Create, Read, Update, Delete against the Product model
 * with an approved seller owner.
 *
 * Run:
 *   npm run test:crud:product
 * (Requires .env.local with MONGODB_URI configured)
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

const envPath = path.resolve(process.cwd(), '.env.local')
dotenv.config({ path: envPath })

import mongoose from 'mongoose'
import connectDB from '../src/lib/mongodb.js'
import User from '../src/models/User.js'
import Product from '../src/models/Product.js'

function log(step: string, data?: any) {
  console.log(`\n--- ${step} ---`)
  if (data !== undefined) console.log(data)
}

function genSku(prefix = 'TST'): string {
  const t = Date.now().toString().slice(-6)
  const r = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${t}-${r}`
}

async function getApprovedSeller() {
  let seller = await (User as any).findOne({ 'sellerProfile.applicationStatus': 'approved' })
  if (!seller) {
    seller = await (User as any).create({
      name: 'CRUD Test Seller',
      email: `crud-seller+${Date.now()}@example.com`,
      password: 'Crud@1234',
      provider: 'email',
      emailVerified: true,
      isSeller: true,
      sellerProfile: {
        shopName: 'CRUD Test Shop',
        applicationStatus: 'approved',
        approvedAt: new Date(),
      },
    })
  }
  return seller
}

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error('ERROR: MONGODB_URI not set. Create .env.local with MONGODB_URI.')
    process.exit(1)
  }

  await connectDB()
  let created: any
  try {
    const seller = await getApprovedSeller()

    // CREATE
    created = await (Product as any).create({
      name: 'CRUD Test Product',
      description: 'Primary data CRUD test product.',
      shortDescription: 'CRUD test',
      category: 'handicrafts',
      price: 123.45,
      stock: 5,
      currency: 'PHP',
      images: ['/box2.png', '/box2.2.png'],
      thumbnailUrl: '/box2.png',
      sku: genSku(),
      artistId: seller._id,
      artistName: seller?.sellerProfile?.shopName || seller.name,
      tags: ['crud', 'test'],
      isActive: true,
      isAvailable: true,
    })
    log('CREATE result', { id: created._id.toString(), name: created.name, sku: created.sku })

    // READ
    const readBack = await (Product as any).findById(created._id).lean()
    log('READ result', { exists: !!readBack, name: readBack?.name, stock: readBack?.stock })

    // UPDATE
    const updated = await (Product as any).findByIdAndUpdate(
      created._id,
      { $set: { price: 199.99, stock: 9, tags: ['crud', 'updated'] } },
      { new: true }
    ).lean()
    log('UPDATE result', { price: updated?.price, stock: updated?.stock, tags: updated?.tags })

    // DELETE
    const del = await (Product as any).findByIdAndDelete(created._id)
    log('DELETE result', { deleted: !!del, deletedId: created._id.toString() })

    // VERIFY DELETION
    const afterDelete = await (Product as any).findById(created._id).lean()
    log('VERIFY', { existsAfterDelete: !!afterDelete })

  } catch (err) {
    console.error('CRUD test failed:', err)
    process.exitCode = 1
  } finally {
    await mongoose.connection.close()
  }
}

run()
