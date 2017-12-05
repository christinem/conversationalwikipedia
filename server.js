var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var html_routes = require('./routes/html');
var wiki_functions = require('./routes/wikipedia')
var sassMiddleware = require('node-sass-middleware');
var apiai = require('apiai')('074deee29e8e4ea68310b5fcb2f87e60');
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
var sessionId = makeid();
var currentCategories

// ------------ Socket and DialogFlow connection ------------ //

/* Source: Adjusted from https://www.smashingmagazine.com/2017/08/ai-chatbot-web-speech-api-node-js/ */
const io = require('socket.io')(server);

io.on('connection', function(socket){
    console.log('a user connected');
});

// When a response from the user is recieved
io.on('connection', function(socket) {
    socket.on('chat message', (text) => {

        // Get a reply from API.AI
        let apiaiReq = apiai.textRequest(text, {
            sessionId: sessionId
        });

        apiaiReq.on('response', (response) => {
            let res = response.result;

            console.log(res);

            let aiText = res.fulfillment.speech;
            let intent = res.metadata.intentName;
            let topic = "";
            if (intent != "new-topic") {
               topic = res.contexts.length != 0 ? res.contexts.find(function(c) {return c.name == "current-topic"}).parameters.topic : res.parameters.topic; 
            }
            let result = "";

            var emitResponseObject = {emitResponse: emitResponse, socket: socket, aiText: aiText};

            // check the intent name and decide action based on it
            if (intent == "request-topic") {
                wiki_functions.checkForTopic(topic, emitResponseObject);
            } else if (intent == 'list-categories' || intent == 'list-all-categories') {
                wiki_functions.getCategories(topic, function (categories) {
                    currentCategories = categories;
                    if (intent == "list-categories") {
                        emitResponseObject.aiText = emitResponseObject.aiText +  " There are " + categories.length + "categories in total. ";
                        wiki_functions.listCategories(currentCategories.splice(0, 5), emitResponseObject, false);
                    } else {
                        wiki_functions.listCategories(currentCategories, emitResponseObject, true);
                    }
                });
            } else if (intent == 'list-more-categories') {
                if (currentCategories.length == 0) {
                    emitResponse(socket, "There are no more categories to list. Do you want to list them again?", "");
                } else {
                    wiki_functions.listCategories(currentCategories.splice(0, 5), emitResponseObject);
                }
            } else if (intent == 'request-category') {
                var category = res.parameters.category;
                wiki_functions.getCategory(topic, category, emitResponseObject);
            } else if (intent == 'request-summary') {
                wiki_functions.getSummary(topic, emitResponseObject);
            } else if (intent == 'correct-error') {
               
            } else {
                emitResponse(socket, aiText, "");
            }
        });

        apiaiReq.on('error', (error) => {
            console.log(error);
        });

        apiaiReq.end();

    });
});

// --------------- Helpers ---------------- //

function emitResponse(socket, aiText, result) {
    result = aiText + result;

    socket.emit('bot reply', result); // Send the result back to the browser!
}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


console.log('Listening on port 3000');