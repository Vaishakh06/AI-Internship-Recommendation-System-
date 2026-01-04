import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const token = authHeader.split(" ")[1];

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ FORCE correct structure
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    if (!req.user.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
}
