const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: './src/main.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'plumsail.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new Dotenv()
      ]
};
