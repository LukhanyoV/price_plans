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

// PROJECT ROUTES
// test route
app.get("/test", (req, res) => {
    res.json({
        status: "success",
        data: "App is running"
    })
})

// LISTEN FOR APP INSTANCE
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`App running on PORT: ${PORT}`))