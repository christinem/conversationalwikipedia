/* Source: Adjusted from https://www.smashingmagazine.com/2017/08/ai-chatbot-web-speech-api-node-js/ */

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const socket = io();

var testing = true;

$('#talk').click(function() {
    recognition.start();
});

$('#test-talk').click(function() {
    let val = $("#test-speech").val();
    socket.emit('chat message', val);
})

recognition.addEventListener('result', (e) => {
    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;

    console.log('Confidence: ' + e.results[0][0].confidence);

    // We will use the Socket.IO here later…
    socket.emit('chat message', text);
});

function synthVoice(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    var voices = synth.getVoices();
    utterance.text = text;
    utterance.voice = voices[48];
    synth.speak(utterance);
}

socket.on('bot reply', function(replyText) {
    if (testing) {
        $("#result").html(replyText);
    } else {
        synthVoice(replyText);
    }
});

