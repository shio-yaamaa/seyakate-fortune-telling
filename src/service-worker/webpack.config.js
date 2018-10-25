const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './notification-sw.ts',
  output: {
    filename: '../../public/notification-sw.js',
    path: path.resolve(__dirname, './')
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          onlyCompileBundledFiles: true,
          compilerOptions: {
            lib: ['ES2017', 'WebWorker'],
            target: 'ES5',
            moduleResolution: 'Node',
            noImplicitAny: true
          }
        }
      }
    ]
  },
  plugins: [
    new Dotenv({
      path: '../../.env'
    })
  ],
  resolve: {
    extensions: ['.ts', '.js']
  }
};