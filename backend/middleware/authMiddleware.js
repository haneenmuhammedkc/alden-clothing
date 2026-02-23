import jwt from "jsonwebtoken"

const authMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization

    // 1️⃣ Token missing
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const token = authHeader.split(" ")[1]

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      // decoded = { id, role, iat, exp }

      req.user = decoded

      // 2️⃣ Role check (ONLY if roles are specified)
      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(decoded.role)
      ) {
        return res.status(403).json({ message: "Forbidden" })
      }

      next() // ✅ authenticated + authorized
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" })
    }
  }
}

export default authMiddleware