const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
// import { engine } from 'express-handlebars';
const methOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('dotenv').config()

// Initialization
const app = express();
require('./database');
require('./config/passport');

// Setting
app.set('port', process.env.PORT || 3000); //process.env.PORT si este puerto si existe en mi computador que use.
app.set('views', path.join(__dirname, 'views')); //Para indicar a mi proyecto la carpeta views, donde estara los html o handlebard=hmtl solo que con algunas mejoras

app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'), //Para inidicar donde esta la carpeta layouts
    partialsDir: path.join(app.get('views'),'partials'), //Son pequeñas partes de html, para utilizar varias veces en cada vista etc
    extname: '.hbs' //Indico que todos mis archivos terminan en .hbs
})); //Par decir de que modo voy a usar mis vistas, seccionar que frm es cambiantes y el principal.

app.set('view engine', '.hbs');

// Middlewares
app.use(express.urlencoded({extended: false})); //No voy a aceptar imgs
app.use(methOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables - para colocar datos que de cualquier parte de mi app tenga acceso.
app.use((req, res, netx) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');    
    res.locals.error = req.flash('error');  
    res.locals.user = req.user || null;  // || Si user no esta auntenticado o logueado es NULO
    netx();
});

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

// Static - para configurar donde estara los archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));//Le digo la carpeta public esta aqui.

// Servidor is listening
app.listen(app.get('port'), (req, res) => {
    console.log("Server on port", app.get('port'));
});
