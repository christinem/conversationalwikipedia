var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var html_routes = require('./routes/html');
var wiki_functions = require('./routes/wikipedia')
var sassMiddleware = require('node-sass-middleware');
var apiai = require('apiai')('f2a2324de92148ac903a7990e9a7ced0');
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

const server = app.listen(process.env.PORT || 3000);

// ------------ Socket and DialogFlow connection ------------ //

/* Source: Adjusted from https://www.smashingmagazine.com/2017/08/ai-chatbot-web-speech-api-node-js/ */
const io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('a user connected');
});

io.on('connection', function(socket) {
  socket.on('chat message', (text) => {

    // Get a reply from API.AI
    let apiaiReq = apiai.textRequest(text, {
      sessionId: makeid()
    });

    apiaiReq.on('response', (response) => {
    	console.log(response);

    	// send result from Dialogflow to browser
	    let aiText = response.result.fulfillment.speech;
	    let topic = response.result.parameters.topic;
	    socket.emit('bot reply', aiText); // Send the result back to the browser!
    });

    apiaiReq.on('error', (error) => {
      console.log(error);
    });

    apiaiReq.end();

  });
});

// --------------- Helpers ---------------- //

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}


console.log('Listening on port 3000');