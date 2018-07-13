const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/public/'
  },
  externals: {
  },
  resolve: {
    alias: {
    },
    extensions: ['.js', '.jsx'],
    enforceExtension: false
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: [
          path.join(__dirname, '../node_modules')
        ]
      },
      {
        test: /.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [
          path.join(__dirname, '../node_modules')
        ]
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?modules&localIdentName=[name]-[local]-[hash:base64:5]&minimize',
          'less-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?modules&localIdentName=[name]-[local]-[hash:base64:5]&minimize',
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                // path.resolve(__dirname, '../node_modules/mixins-sass/src/mixins.scss'),
                path.resolve(__dirname, '../client/global/index.scss')
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[chunkhash:8].css',
      chunkFilename: '[id].[chunkhash:8].css'
    }),
    new webpack.LoaderOptionsPlugin({ options: {} })
  ]
}
