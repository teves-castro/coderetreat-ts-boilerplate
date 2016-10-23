var path = require("path")

module.exports = function (config) {

  config.set({

    browsers: ["Chrome"],
    frameworks: ["mocha"],
    reporters: ["mocha"],

    files: [
      // "test/**/*spec.ts"
      "tests.webpack.js"
    ],

    preprocessors: {
      // "test/**/*spec.ts": ["webpack", "sourcemap"]
      "tests.webpack.js": ["webpack", "sourcemap"]
    },

    webpack: {
      // devtool: "inline-source-map",

      resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
      },

      module: {
        // preLoaders: [{ test: /\.ts?$/, loader: "tslint" }],
        loaders: [{ test: /\.ts?$/, loader: "babel!ts-loader" }]
      },

      // tslint: {
      //   emitErrors: true,
      //   failOnHint: true
      // },
    }
  })

}
