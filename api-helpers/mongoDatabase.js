import {
  MongoClient,
  MongoNetworkError,
  MongoNotConnectedError,
  MongoServerSelectionError,
  MongoTopologyClosedError,
} from 'mongodb'

const clientsKey = Symbol.for('d-anmol.mongo-clients')
const databaseClients = globalThis[clientsKey] || (globalThis[clientsKey] = new Map())

export class DatabaseUnavailableError extends Error {
  constructor(message, cause) {
    super(message, { cause })
    this.name = 'DatabaseUnavailableError'
    this.statusCode = 503
  }
}

export function isMongoUnavailableError(error) {
  return error instanceof DatabaseUnavailableError
    || error instanceof MongoNetworkError
    || error instanceof MongoNotConnectedError
    || error instanceof MongoServerSelectionError
    || error instanceof MongoTopologyClosedError
}

export async function getMongoDatabase() {
  const uri = process.env.MONGODB_URI?.trim()
  if (!uri) throw new DatabaseUnavailableError('Set MONGODB_URI to connect the application to MongoDB.')

  const databaseName = process.env.MONGODB_DB?.trim() || ''
  if (!databaseName) throw new DatabaseUnavailableError('Set MONGODB_DB to choose the application database.')
  let clientPromise = databaseClients.get(uri)

  if (!clientPromise) {
    let client
    try {
      client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000, maxPoolSize: 10 })
    } catch (error) {
      throw new DatabaseUnavailableError('MONGODB_URI is not a valid MongoDB connection string.', error)
    }

    clientPromise = Promise.resolve()
      .then(() => client.connect())
      .then(() => client)
      .catch(async (error) => {
        databaseClients.delete(uri)
        try {
          await client.close()
        } catch (closeError) {
          console.error('MongoDB client cleanup failed after a connection error:', closeError.name)
        }
        throw new DatabaseUnavailableError(
          'Unable to connect to MongoDB. Confirm Atlas network access and connection settings.',
          error,
        )
      })
    databaseClients.set(uri, clientPromise)
  }

  const client = await clientPromise
  return client.db(databaseName)
}
