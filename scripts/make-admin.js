// One-off bootstrap: grants the "admin" role to a user directly in MongoDB.
// Needed because /admin now requires an account with role "admin", and there's
// no UI path to create the very first one.
//
// Usage: node scripts/make-admin.js <username>
import 'dotenv/config'
import { MongoClient } from 'mongodb'

const username = process.argv[2]
if (!username) {
  console.error('Usage: node scripts/make-admin.js <username>')
  process.exit(1)
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
const client = new MongoClient(MONGODB_URI)

try {
  await client.connect()
  const users = client.db('codelingo').collection('users')
  const result = await users.updateOne({ username: username.trim().toLowerCase() }, { $set: { role: 'admin' } })
  if (result.matchedCount === 0) {
    console.error(`No user found with username "${username}". Sign up first, then run this again.`)
    process.exit(1)
  }
  console.log(`"${username}" is now an admin.`)
} finally {
  await client.close()
}
