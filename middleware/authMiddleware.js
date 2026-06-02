
/* =========================
   only logged-in users can access 
========================= */
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.send("No token, access denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.send("Invalid token");
  }
};

module.exports = protect;