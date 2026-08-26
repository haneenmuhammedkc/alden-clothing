import dotenv from "dotenv"
dotenv.config()

//Validates mandatory environment variables required for safe production startup.

const validateEnv = () => {
  const requiredVars = ["MONGO_URL", "JWT_SECRET"]
  const missing = requiredVars.filter((key) => !process.env[key])

  if (missing.length > 0) {
    const errorMsg = `[FATAL STARTUP ERROR] Missing mandatory environment variables: ${missing.join(", ")}`
    console.error(errorMsg)
    if (process.env.NODE_ENV === "production") {
      process.exit(1)
    }
  }
}

validateEnv()