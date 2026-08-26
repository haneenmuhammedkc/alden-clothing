import "./config/env.js"

import mongoose from "mongoose"
import connectDB from "./config/database.js"
import app from "./app.js"

connectDB()

const Port = process.env.PORT || 5000

const server = app.listen(Port, () => {
  console.log(`Server is Running at Port ${Port}`)
})

// 🔒 Graceful Process Shutdown (SEC-MED-03)
const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}. Initiating graceful shutdown...`)
  server.close(async () => {
    console.log("HTTP server closed.")
    try {
      await mongoose.connection.close()
      console.log("MongoDB connection closed.")
      process.exit(0)
    } catch (err) {
      console.error("Error during Mongoose disconnection:", err)
      process.exit(1)
    }
  })
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"))
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))