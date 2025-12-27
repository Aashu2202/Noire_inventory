const Server = require("./src/app");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 5000;

console.log("🚀 Starting Server...");

Server.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`🔗 Connected to Supabase Project: ${process.env.SUPABASE_URL}`);
});