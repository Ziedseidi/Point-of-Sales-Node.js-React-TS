import app from './app'
import express from 'express'
import envConfig from '../configs/env'
import connectDB from '../configs/dbconnector'
import path from 'path';


const PORT  = envConfig.port !== null && envConfig.port !== undefined ? envConfig.port : 4500




connectDB()
.then(() => {
  // Start the server
  app.listen(PORT, () => {
    console.log(`
🚀 Server ready at: http://localhost:${PORT}
⭐️ Welcome to POS & IMS By Pithos Global Technology`)
  })
})
.catch((error) => {
  console.error('🚨 Failed to connect to MongoDB:', error)
  try {
    // Some code that might throw an error
    throw new Error('🚨 Failed to connect to MongoDB:')
  } catch (error) {
    if (error instanceof Error) {
      console.log(error) // Explicitly specify the type with type assertion
    }
  }
})
