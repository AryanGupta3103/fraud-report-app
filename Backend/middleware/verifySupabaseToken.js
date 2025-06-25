const { jwtVerify } = require("jose");

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

const verifySupabaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.warn("🛑 No Authorization header received.");
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    console.warn("🛑 Authorization header is malformed.");
    return res.status(401).json({ error: "Malformed Authorization header" });
  }

  try {
    // 🧪 DEBUG: Log the first few characters of the token
    console.log("🔐 Verifying token:", token.substring(0, 20) + "...");

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(SUPABASE_JWT_SECRET),
      { algorithms: ["HS256"] }
    );

    req.user = payload;
    console.log("✅ Token verified. User:", payload.email || payload.sub);
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = verifySupabaseToken;
