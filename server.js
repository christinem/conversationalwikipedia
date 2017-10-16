var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var sassMiddleware = require('node-sass-middleware');
var routes = require('./routes/routes');
var app = express();

app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'public/stylesheets'),
    debug: true,
    prefix:  '/public/stylesheets' 
}));


app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// --------- Routes ------------ //

app.get('/', html_routes.homePage);

app.get('/scholar_evaluate', search_routes.googleScholarEvaluate);

app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000');