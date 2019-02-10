# word2vec_example

Simple examples how start using word2vec module.

Before usage install dependencies:

```
npm install
```

Instructions how to use:

```
Usage: node cli.js <option> <params>
    option 1: clear <filename>
    option 2: train <cleared_filename> <vector_length>
        <cleared_filename> from step 1
        <vector_length>     optional, by default will be used 100
    option 3: similarity <word> <number_neighbors>
        <word>             for which want find nearest neighbors
        <number_neighbors> optional, amount of neighbors to show
    option 4: analogy <word> <pair_word_1> <pair_word_2> <number_analogies>
        <word>             for which want find analogies
        <pair_word_1>      first word of the analogy pair
        <pair_word_2>      second word of the analogy pair
        <number_analogies> optional, amount of analogies to show
```

Commands for this cli examples:

```
node cli.js clear file
node cli.js train file_cleared
node cli.js similarity arya
node cli.js analogy daenerys cersei queen
```