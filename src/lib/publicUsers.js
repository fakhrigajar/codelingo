import { createLocalCollection } from './localStore'
import { DEFAULT_USERS } from '../data/data'

const users = createLocalCollection('users', 'username', DEFAULT_USERS)
export async function fetchPublicUsers() {
  return (await users.list()).map(({ username, displayName, avatar }) => ({ username, displayName, avatar }))
}
