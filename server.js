let express = require("express")
let app = express()
let bodyParser = require('body-parser')
let session = require('express-session')

//Moteur de template
app.set('view engine', 'ejs')

//middleware
app.use('/assets', express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
    secret: 'ddd',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))
app.use(require('./middlewares/flash'))

//Routes
app.get('/', (req, res) => {
    /* if(req.session.error){
        res.locals.error = req.session.error;
        req.session.error = undefined;
    } */
    
    let Message = require('./models/message')
        Message.all(function(messages){
            res.render('page/index', {messages: messages})
        })
})

app.post('/', (req, res) => {
    if(req.body.message === undefined || req.body.message === ''){
        //res.render('page/index', {error : "Vous n'avez pas entré de message :( "})
        //req.session.error = "Vous n'avez pas entré de message :( ";
        req.flash('error', "Vous n'avez pas entré de message :( ")
        res.redirect('/')
    }else{
        let Message = require('./models/message')
        Message.create(req.body.message, function(){
            req.flash('success', "Merci ! :) ")
            res.redirect('/')
        })
    }
})

app.get('/message/:id', (req, res) => {
    let message = require('./models/message')

    message.find(req.params.id, function(message){
        res.render('message/show', {message: message})
    })
})

app.listen(8080)