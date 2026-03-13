require("dotenv").config({ path: ".env.local" });
const url = process.env.DATABASE_URL;
console.log("DATABASE_URL set:", !!url);
if (url) {
  console.log("Starts with:", url.substring(0, 50) + "...");
}
process.exit(url ? 0 : 1);
