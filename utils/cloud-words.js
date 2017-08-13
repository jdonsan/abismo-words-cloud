const R = require('ramda');
const promisify = require("es6-promisify");
const fs = require('fs');
const path = require('path');
const sw = require('stopword');
const swES = require('./sw_es');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

module.exports.calculate = function (gender) {
    return readFile(path.resolve(__dirname, '../data/authors.json'), 'utf-8')
        .then(JSON.parse)
        .then(R.filter(author => author.gender === gender))
        .then(R.map(author => author.description))
        .then(R.flatten)
        .then(R.join(' '))
        .then(R.split(' '))
        .then(words => sw.removeStopwords(words, [...sw.en, ...swES]))
        .then(R.countBy(R.toLower))
        .then(words => Object.entries(words))
        .then(R.sortBy(R.prop(1)))
        .then(R.reverse)
        .then(R.take(50))
        .then(R.map(node => ({ text: node[0], weight: node[1] })));
}