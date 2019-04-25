const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, './client/src/index.jsx'),
  output: {
    path: path.resolve(__dirname, './client/dist/'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      },
      {
        test: /.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: 'css-[local]___[hash:base64:5]'
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts']
  },
  watchOptions: {
    poll: true,
    ignored: /node_modules/
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'client/src/index.html'
    }),
    new HtmlWebpackPlugin({
      template: 'client/src/after-auth.html',
      filename: 'after-auth.html'
    })
  ]
};

