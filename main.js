const pg = require('pg')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config();

const CarService = require("./services/car")
const UserAccountService = require("./services/useraccount")

const app = express()
app.use(bodyParser.urlencoded({ extended: false })) // application/x-www-form-urlencoded
app.use(bodyParser.json()) // application/json
app.use(cors())
app.use(morgan('combined')); // toutes les requêtes HTTP dans le log du serveur

const dsn = process.env.CONNECTION_STRING
const port = process.env.PORT

console.log(`Connecting to database ${dsn}`)
const db = new pg.Pool({ connectionString:  dsn})
const carService = new CarService(db)
const userAccountService = new UserAccountService(db)
const jwt = require('./jwt')(userAccountService)
require('./api/car')(app, carService, jwt)
require('./api/useraccount')(app, userAccountService, jwt)
require('./datamodel/seeder')(userAccountService, carService)
    .then(app.listen(
        port,
        () => { console.log(`Listening on the port ${port}`)}
    ))
