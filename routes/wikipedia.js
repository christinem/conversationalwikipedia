var wikipedia = require("wtf_wikipedia");

exports.getResultfromWikipedia = function(topic) {

    wikipedia.from_api(topic, "en", function(markup) {
        var data = wikipedia.parse(markup);
        var sentences = data.sections[0].sentences;
        var result = "";

        sentences.forEach(function(s) {
            result += s.text + " ";
        });

        return result;
    });
};