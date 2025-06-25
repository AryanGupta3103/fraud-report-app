module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log("=== AUTH DEBUG ===");
  console.log("Authorization header:", authHeader);

  if (!authHeader) {
    console.log("Missing header");
    return res.status(403).send('No authorization header');
  }

  const [scheme, token] = authHeader.split(' ');
  console.log("Scheme:", scheme);
  console.log("Token:", token);

  if (scheme === 'Bearer' && token === 'demo-token') {
    console.log("✅ Auth passed");
    return next();
  }

  console.log("❌ Invalid token");
  return res.status(403).send('Invalid token');
};
