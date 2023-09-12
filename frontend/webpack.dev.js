const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const GLOBALS = {
  'process.env.ENDPOINT': JSON.stringify(
    process.env.ENDPOINT || 'http://127.0.0.1:9000/api',
  ),
};

module.exports = {
  mode: 'development',
  cache: true,
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: ['@babel/polyfill', path.join(__dirname, 'src/index.jsx')],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['src', 'node_modules'],
  },
  devServer: {
    inline: true,
    contentBase: path.join(__dirname, 'public'),
    historyApiFallback: true,
    disableHostCheck: true,
    host: process.env.HOST || '127.0.0.1',
    port: process.env.PORT || 8000,
    watchOptions: {
      poll: 1000,
    },
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /.*css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /.*(jpg|jpeg|png|svg)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader',
        query: {
          presets: [
            '@babel/preset-react',
            [
              '@babel/env',
              { targets: { browsers: ['last 2 versions'] }, modules: false },
            ],
          ],
          plugins: ['@babel/plugin-proposal-class-properties'],
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin(GLOBALS),
  ],
};
