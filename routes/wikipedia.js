var wikipedia = require("wtf_wikipedia");

exports.checkForTopic = function(topic, callback) {
    wikipedia.from_api(topic, "en", function(markup) {
        var data = wikipedia.parse(markup);
        result = "";
        console.log(data);

        if (data.type == "page") {
            callback.emitResponse(callback.socket, callback.aiText, result);
        } else {
            var aiText = "I'm sorry, I don't have any information about " + topic + ". Would you like to choose a new topic?";
            callback.emitResponse(callback.socket, aiText, result);
        }
    });
}

exports.getSummary = function(topic, callback) {
    wikipedia.from_api(topic, "en", function(markup) {
        console.log("Summary function topic: ", topic);
        var data = wikipedia.parse(markup);
        var sentences = data.sections[0].sentences;
        callback(sentences);
    });
}

exports.getCategories = function(topic, callback) {
    wikipedia.from_api(topic, "en", function(markup) {
        var data = wikipedia.parse(markup);
        var categories = data.sections.map(function(s) { return s.title });

        callback(categories);
    });
}

exports.listCategories = function(categories, callback, allCategories) {
    var result = "";

    for (var i = 0; i < categories.length - 1; i++) {
        result += categories[i] + ", ";
    }

    result += "and " + categories[categories.length - 1];

    if (!allCategories) {
        result = result + ". Would you like to hear more categories?";
    }

    callback.emitResponse(callback.socket, callback.aiText, result);
}

exports.getCategory = function(topic, category, callback) {
    wikipedia.from_api(topic, "en", function(markup) {
        var data = wikipedia.parse(markup);
        var section = data.sections.find(function(s) { return s.title.toLowerCase() == category.toLowerCase()});
        var result = "";
        var aiText = callback.aiText;
        var sentences = [];

        if (section != undefined && section.sentences.length > 0) {
            sentences = section.sentences;
        }

        callback(sentences);
    });
};

exports.saySection = function(sentences, callback) {
    var result = "";

    sentences.forEach(function(s) {
        result += s.text + " ";
    });

    callback.emitResponse(callback.socket, callback.aiText, result + ". Would you like me to continue?");
}
