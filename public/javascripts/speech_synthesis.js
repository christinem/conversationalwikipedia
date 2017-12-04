/* Source: Adjusted from https://www.smashingmagazine.com/2017/08/ai-chatbot-web-speech-api-node-js/ */

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const socket = io();
const synth = window.speechSynthesis;

var testing = false;

$('#talk').click(function() {
    synth.cancel();
    recognition.start();
});

// Testing function -- remove after
$('#test-talk').click(function() {
    let val = $("#test-speech").val();
    socket.emit('chat message', val);
})

recognition.addEventListener('result', (e) => {
    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;

    console.log('Confidence: ' + e.results[0][0].confidence);

    socket.emit('chat message', text);
});

function synthVoice(text) {
    const utterance = new SpeechSynthesisUtterance();
    // var voices = synth.getVoices();
    // utterance.text = text;
    // utterance.voice = voices[48];
    speakResponse(text);
    // speechUtteranceChunker(utterance, {}, function() {});
}

socket.on('bot reply', function(replyText) {
    if (testing) {
        $("#result").html(replyText);
    } else {
        $("#result").html(replyText);
        synthVoice(replyText);
    }
});

/* Source: https://stackoverflow.com/questions/21947730/chrome-speech-synthesis-with-longer-texts */
var sayit = function ()
{
    var msg = new SpeechSynthesisUtterance();
    var voices = synth.getVoices();

    msg.voice = voices[48]; // Note: some voices don't support altering params
    msg.voiceURI = 'native';
    // msg.volume = 1; // 0 to 1
    // msg.rate = 1; // 0.1 to 10
    // msg.pitch = 2; //0 to 2
    msg.lang = 'en-GB';
    msg.onstart = function (event) {

        console.log("started");
    };
    msg.onend = function(event) {
        console.log('Finished in ' + event.elapsedTime + ' seconds.');
    };
    msg.onerror = function(event)
    {

        console.log('Errored ' + event);
    }
    msg.onpause = function (event)
    {
        console.log('paused ' + event);

    }
    msg.onboundary = function (event)
    {
        console.log('onboundary ' + event);
    }

    return msg;
}


var speakResponse = function (text)
{
    speechSynthesis.cancel(); // if it errors, this clears out the error.

    var sentences = text.split(".");
    for (var i=0;i< sentences.length;i++)
    {
        var toSay = sayit();
        toSay.text = sentences[i];
        speechSynthesis.speak(toSay);
    }
}