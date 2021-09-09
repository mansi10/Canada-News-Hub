const express = require('express');
const newspostRoutes = require ('../routes/newsposts')
const userRoutes = require ('../routes/user')
const requestRoutes = require ('../routes/requests')

const bodyParser = require('body-parser')

const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization")
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS")
    res.setHeader("Content-Type", "application/json");

    next();
})

app.use(
    bodyParser.urlencoded({
      extended: true
    })
  )
app.use(bodyParser.json())

app.use('/api/news' , newspostRoutes);
app.use('/api/user' , userRoutes);
app.use('/api/requests' , requestRoutes);


app.use('/', (req, res)=>{
    res.status(404).json({
        "message": "path not found",
        "status": false
    })
})

module.exports = app