var webpack = require("webpack")
var path = require("path")

var TARGET = process.env.npm_lifecycle_event
process.env.BABEL_ENV = TARGET

var APP_PATH = path.resolve(__dirname, "src/index.ts")
var BUILD_PATH = path.resolve(__dirname, "dist")

module.exports = {
  entry: APP_PATH,
  output: {
    path: BUILD_PATH,
    publicPath: "/assets/",
    filename: "bundle.js",
  },

  devtool: "source-map",

  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },

  module: {
    preLoaders: [{ test: /\.ts?$/, loader: "tslint" }],
    loaders: [{ test: /\.ts?$/, loader: "babel!ts-loader" }]
  },

  tslint: {
    emitErrors: true,
    failOnHint: true
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ]
}