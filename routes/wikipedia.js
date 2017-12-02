var wikipedia = require("wtf_wikipedia");

exports.getSummary = function(topic, callback) {
    wikipedia.from_api(topic, "en", function(markup) {
        console.log("Summary function topic: ", topic);
        var data = wikipedia.parse(markup);
        var sentences = data.sections[0].sentences;
        var result = "";

        sentences.forEach(function(s) {
            result += s.text + " ";
        });

        callback.emitResponse(callback.socket, callback.aiText, result);
    });
}

exports.getCategories = function(topic, callback) {
    wikipedia.from_api(topic, "en", function(markup) {
        var data = wikipedia.parse(markup);
        var categories = data.sections.map(function(s) { return s.title });
        var result = "";

        categories.forEach(function(c) {
            result += c + ", ";
        })

        callback.emitResponse(callback.socket, callback.aiText, result);
    });
}

exports.getCategory = function(topic, category, callback) {
    wikipedia.from_api(topic, "en", function(markup) {
        var data = wikipedia.parse(markup);
        var section = data.sections.find(function(s) { return s.title.toLowerCase() == category.toLowerCase()});
        var result = "";
        var aiText = callback.aiText;

        if (section == undefined || section.sentences.length == 0) {
            result = "I'm sorry, I don't have any information on " + category + " for " + topic + ". Do you want to choose another category or pick a new topic?";
            aiText = "";
        } else {
            section.sentences.forEach(function(s) {
                result += s.text + " ";
            });
        }

        callback.emitResponse(callback.socket, aiText, result);
    });
};
