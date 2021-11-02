module.exports = {
  mode: 'none',
  entry: './src/app.js',
  output: {
    path: __dirname + '/dist',
    filename: 'app.js',
  },
  devServer: {
    static: {
      directory: require('path').join(__dirname, 'dist'),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
