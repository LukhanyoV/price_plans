const pgp = require("pg-promise")({})
const config = {
    connectionString: "postgres://rinnylqp:aQhMPmS0v3vByzVscw3qa45Lu6dllK6u@jelani.db.elephantsql.com/rinnylqp"
}
if(process.env.NODE_ENV === "production"){
    config.ssl = {
        rejectUnauthorized: false
    }
} 
const db = pgp(config)
module.exports = db