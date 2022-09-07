const express = require("express")
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser")
const session = require("express-session")
const flash = require("express-flash")
const app = express()

// SET UP PROJECT VIEW ENGINE
app.engine("handlebars", exphbs.engine({defaultLayout: "main"}))
app.set("view engine", "handlebars")

// SETUP PROJECT MIDDLEWARE
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(session({
    secret: "mycatwalkedonmykeyboard",
    resave: true,
    saveUninitialized: false
}))
app.use(flash())

// USE DATABASE AND BILL SERVICE WITH ROUTES
const db = require("./db/connection")
const billService = require("./services/bill-service")(db)
const routes = require("./routes/routes")(billService)

// PROJECT ROUTES
// GET ROUTES
app.get("/", routes.index)
app.get("/price_plans", routes.plans)
app.get("/price_plans/:id", routes.planUsers)
app.get("/link_user", routes.choosePlan)

// POST ROUTES
app.post("/calc_bill", routes.calcBill)
app.post("/link_user", routes.allocateUser)

// LISTEN FOR APP INSTANCE
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`App running on PORT: ${PORT}`))