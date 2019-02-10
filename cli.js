const path = require('path');
const fs   = require('fs-extra');
const w2v  = require('word2vec');

function showUsage() {
    console.log('Usage: node cli.js <option> <params>');

    console.log(`\t option 1: clear <filename>`);
    console.log(`\t option 2: train <cleared_filename> <vector_length>`);
    console.log(`\t\t <cleared_filename> from step 1`);
    console.log(`\t\t <vector_length>     optional, by default will be used 100`);
    console.log(`\t option 3: similarity <word> <number_neighbors>`);
    console.log(`\t\t <word>             for which want find nearest neighbors`);
    console.log(`\t\t <number_neighbors> optional, amount of neighbors to show`);
    console.log(`\t option 4: analogy <word> <pair_word_1> <pair_word_2> <number_analogies>`);
    console.log(`\t\t <word>             for which want find analogies`);
    console.log(`\t\t <pair_word_1>      first word of the analogy pair`);
    console.log(`\t\t <pair_word_2>      second word of the analogy pair`);
    console.log(`\t\t <number_analogies> optional, amount of analogies to show`);
}
const OPTIONS = [
    'clear',
    'train',
    'similarity',
    'analogy'
]

if (process.argv.length < 3) showUsage();
if (!OPTIONS.includes(process.argv[2])) {
    console.log(`Wrong option ${process.argv[2]}.\n`);
    showUsage();
}

async function cli() {
    try {
        switch (process.argv[2]) {
            case 'clear':
                await clear(process.argv[3]);
                console.log(`cleared_${process.argv[3]} successfully completed.`);
                break;
            case 'train':
                await train(process.argv[3], process.argv[4]);
                console.log(`training successfully completed.`);
                break;
            case 'similarity':
                await similarity(process.argv[3], process.argv[4] || null);
                console.log(`similarity search completed.`);
                break;
            case 'analogy':
                if (process.argv.length < 6) {
                    console.log('Pair for analogy not provided.\n');
                    return showUsage();
                }
                await analogy(
                    process.argv[3],
                    [ process.argv[4], process.argv[5] ],
                    process.argv[6]
                );
                console.log(`similarity search completed.`);
                break;
            default:
                break;
        }
    } catch (error) {
        console.error('Something went wrong:');
        console.error(error);
    }
}

cli();

// Clear option
async function clear(filePath) {
    const contentRaw = await fs.readFile(filePath);
    const content = clearText(contentRaw.toString());

    return fs.writeFile(`${filePath}_cleared`, content);
}

function clearText(text) {
    return text
        .toLowerCase()
        .replace(/[^A-Za-zА-Яа-яЁёЇїІіҐґЄє0-9\-]|\s]/g, ' ')
        .replace(/\s{2,}/g, ' ');
}

// Train option
async function train(corpusFilePath, vectorSize = 100) {
    return new Promise(resolve => {
        w2v.word2vec(corpusFilePath, 'vectors.txt', {
            size: vectorSize,
            binary: 1
        }, () => {
            console.log('DONE');
            resolve();
        });
    })
}

// Similarity option
function similarity(word, number_neighbors = 10) {
    return new Promise((resolve, reject) => {
        w2v.loadModel('vectors.txt', (error, model) => {
            if (error) reject();
            console.log('SIZE: ', model.size);
            console.log('WORDS: ', model.words);
        
            console.time('mostSimilar');
            console.log(model.mostSimilar(word, number_neighbors));
            console.timeEnd('mostSimilar');

            resolve()
        });
    });
}

function analogy(word, pair, number_neighbors = 10) {
    return new Promise((resolve, reject) => {
        w2v.loadModel('vectors.txt', (error, model) => {
            if (error) reject();
            console.log('SIZE: ', model.size);
            console.log('WORDS: ', model.words);
        
            try {
                console.time('mostSimilar');
                console.log(model.analogy(word, pair, number_neighbors));
                console.timeEnd('mostSimilar');
            } catch (error) {
                reject(error)
            }

            resolve()
        });
    });
}