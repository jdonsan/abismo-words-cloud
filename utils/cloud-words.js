const R = require('ramda');
const promisify = require("es6-promisify");
const fs = require('fs');
const path = require('path');
const sw = require('stopword');
const swES = require('./sw_es');
const readFile = promisify(fs.readFile);

module.exports.calculate = function (gender) {
    const getAuthors = () => readFile(path.resolve(__dirname, '../data/authors.json'), 'utf-8').then(JSON.parse);
    const filterAuthors = R.filter(R.whereEq({ gender: gender }));
    const getDescriptionsByAuthor = R.pipe(R.pluck('description'), R.flatten);
    const splitWords = R.pipe(R.join(' '), R.split(' '));
    const removeStopwords = words => sw.removeStopwords(words, [...sw.en, ...swES]);
    const countWords = R.countBy(R.toLower);
    const convertNodeCloud = R.compose(R.map(R.zipObj(['text', 'weight'])), R.toPairs);
    const sortByWeight = R.sort(R.descend(R.prop('weight')));
    const createNodeCloud = node => ({ text: node[0], weight: node[1] });

    return getAuthors()
        .then(filterAuthors)
        .then(getDescriptionsByAuthor)
        .then(splitWords)
        .then(removeStopwords)
        .then(countWords)
        .then(convertNodeCloud)
        .then(sortByWeight)
        .then(R.take(50));
}
