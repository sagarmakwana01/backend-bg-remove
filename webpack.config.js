const path = require('path');
module.exports = {
    mode: 'development', // or 'production' or 'none'
    entry: {
        index: './src/static/index.js',
        main: './src/static/main.js',
        home: './src/static/home.js',
        createFrams: './src/static/createFrams.js',
        createBackground: './src/static/createBackground.js',
        createSticker: './src/static/createSticker.js',
        createTemplate: './src/static/createTemplate.js',   

    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [{
            exclude: /node_modules/ 
        }]
    }
};