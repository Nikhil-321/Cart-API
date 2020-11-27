const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const homeRouter = require('./routes/product')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const flash = require('express-flash')
const session = require('express-session')
const multer = require('multer')
const MongoDbStore = require('connect-mongo')(session)


const app = express()

const port = process.env.PORT || 3000;

app.use(express.json())


app.use(bodyParser.urlencoded({extended : false}))





// Database Connection

const url = process.env.MONGODB_URI || 'mongodb://localhost/product';
mongoose.connect(url , {useNewUrlParser: true , useCreateIndex: true, useUnifiedTopology: true, useFindAndModify : true});
const connection = mongoose.connection;
connection.once('open' , () => {
    console.log('Datebase Connected');
}).catch( err => {
    console.log('Connected Failed');
});





// Setting view Template Engine

app.set('view engine' , 'ejs')
app.set('views' , __dirname + '/views')
app.set('layout' , 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))







// Session storing in mongoDb


 let mongoStore = new MongoDbStore({
    mongooseConnection : connection,
    collection : 'session'

})





app.use(flash())





// Session config and flash


app.use(session({
    secret: 'Testing',
    store : mongoStore,
    resave : false,
    saveUninitialized : false,
    cookie : { maxAge : 1000*60*60*24} // 24 hours

}))



// Global Middlewares

app.use((req,res,next) =>{
    res.locals.session = req.session
    next()
})






// Using router
app.use('/' , homeRouter)




app.listen(port , () =>{
    console.log(`Server is running on ${port}`)
})