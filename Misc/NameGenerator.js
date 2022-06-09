const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

const customConfig = {
    dictionaries: [adjectives, colors],
    separator: ' ',
    length: 2,
};

module.exports = {
    genName: () => uniqueNamesGenerator(customConfig),
    genNames: function () {
        let names = [];
        for (var i = 0; i < 3; i++) {
            names.push({ "firstName": genName(), "secondName": genName() })
        }
        return names;
    }
};