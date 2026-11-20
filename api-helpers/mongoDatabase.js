import { MongoClient } from 'mongodb'

const databaseClients = new Map()

export class DatabaseUnavailableError extends Error {
  constructor(message, cause) {
    super(message, { cause })
    this.name = 'DatabaseUnavailableError'
    this.statusCode = 503
  }
}

export async function getMongoDatabase() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new DatabaseUnavailableError('Set MONGODB_URI to connect the application to MongoDB.')

  const databaseName = process.env.MONGODB_DB || ''
  if (!databaseName) throw new DatabaseUnavailableError('Set MONGODB_DB to choose the application database.')
  const clientKey = `${uri}\n${databaseName}`
  let clientPromise = databaseClients.get(clientKey)

  if (!clientPromise) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 })
    clientPromise = client.connect()
      .then(() => client.db(databaseName))
      .catch((error) => {
        databaseClients.delete(clientKey)
        throw new DatabaseUnavailableError(
          'Unable to connect to MongoDB. Confirm the service is running and the connection settings are correct.',
          error,
        )
      })
    databaseClients.set(clientKey, clientPromise)
  }

  return clientPromise
}
