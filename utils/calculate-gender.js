const axios = require('axios');
const R = require('ramda');
const promisify = require("es6-promisify");
const fs = require('fs');
const path = require('path');
const urlencode = require('urlencode');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const isTalk = talk =>
    !!talk.contents
    && talk.contents.type !== 'EXTEND'
    && talk.contents.type !== 'BREAK';

const getGender = author => {
    const url = 'https://us-central1-hombre-o-mujer.cloudfunctions.net/gender?name='
        + urlencode(author.name.split(' ')[0]);
    return axios.get(url);
}

const authorsMod = (() => {
    let authorsMut;

    return {
        setAuthors: authors => authorsMut = authors,
        setGenderInAuthor: responses =>
            responses.map(((response, index) => {
                authorsMut[index].gender = response.data.gender;
                return authorsMut[index];
            })),
    }
})()

const saveFile = authors =>
    writeFile(path.resolve(__dirname, '../data/authors.json'), authors, 'utf-8')

readFile(path.resolve(__dirname, '../data/agenda.json'), 'utf-8')
    .then(JSON.parse)
    .then(agenda => agenda.days)
    .then(R.map(day => day.tracks))
    .then(R.flatten)
    .then(R.map(track => track.slots))
    .then(R.flatten)
    .then(R.filter(isTalk))
    .then(R.map(talk => talk.contents.authors))
    .then(R.flatten)
    .then(R.tap(authorsMod.setAuthors))
    .then(R.map(getGender))
    .then((promises) => Promise.all(promises))
    .then(authorsMod.setGenderInAuthor)
    .then(JSON.stringify)
    .then(saveFile)
    .catch(console.error);
