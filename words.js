/* eslint-disable */
const natural = require('natural');
const fs = require('fs');

// Load the dataset
const data = fs.readFileSync('questions_dataset.csv', 'utf8').split('\n').map(line => line.split(',')[1]);

// Tokenize and preprocess the questions
const tokenizer = new natural.WordTokenizer();
const stopWords = new Set(natural.stopwords.words);
const punctuation = new Set('!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~');

const preprocessedQuestions = data.map(question => {
    const tokens = tokenizer.tokenize(question.toLowerCase())
        .filter(token => !stopWords.has(token) && !punctuation.has(token));
    return tokens;
});

// Train Word2Vec model
const Word2Vec = natural.Word2Vec;
const model = new Word2Vec();

model.train(preprocessedQuestions, {
    vectorSize: 100,
    iterations: 10,
    minCount: 1,
    windowSize: 5
});

// Save the model
model.save('word2vec_model.json');

// Get the word vector for a specific word
const wordVector = model.getVector('prerequisites');

console.log('Word Vector for "prerequisites":', wordVector);
