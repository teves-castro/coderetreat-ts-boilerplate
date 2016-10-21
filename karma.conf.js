var path = require("path")

module.exports = function (config) {

  config.set({

    browsers: ["Chrome"],
    frameworks: ["mocha"],
    reporters: ["mocha"],

    files: [
      "test/**/*spec.ts"
    ],

    preprocessors: {
      "test/**/*spec.ts": ["webpack", "sourcemap"]
    },

    webpack: {
      devtool: "inline-source-map",

      resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
      },

      module: {
        loaders: [
          { test: /\.ts?$/, loader: "babel!ts-loader" }
        ]
      }
    }
  })

}
