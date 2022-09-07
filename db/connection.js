const pgp = require("pg-promise")({})
const config = {
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:nimda@localhost:5432/price_plans"
}
if(process.env.NODE_ENV === "production"){
    config.ssl = {
        rejectUnauthorized: false
    }
} 
const db = pgp(config)
module.exports = db