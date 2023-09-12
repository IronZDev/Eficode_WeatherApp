const webpack = require('webpack');
const path = require('path');

const TransferWebpackPlugin = require('transfer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const GLOBALS = {
  'process.env.ENDPOINT': JSON.stringify(
    process.env.ENDPOINT || 'http://127.0.0.1:9000/api',
  ),
};

module.exports = {
  mode: 'production',
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  entry: {
    main: ['@babel/polyfill', path.join(__dirname, 'src/index.jsx')],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['src', 'node_modules'],
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
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
      template: 'src/public/index.html',
      filename: 'index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new TransferWebpackPlugin([{ from: 'src/public' }], '.'),
    new webpack.DefinePlugin(GLOBALS),
  ],
};
