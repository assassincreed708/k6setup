const path = require("path");

module.exports = {
  resolve: {
    extensions: [".ts", ".js"],
  },

  mode: "development",

  entry: {
    mobileapi_load: "./src/tests/mobileAPI/mobileapi_load.ts",
    rua_load: "./src/tests/rua/rua_load.ts"
  },

  output: {
    path: path.resolve(__dirname, "dist"),

    libraryTarget: "commonjs",

    filename: "[name].js",
  },

  module: {
    rules: [
      {
        test: /\.ts$/,

        // exclude: /node_modules/,

        loader: "babel-loader",

        options: {
          presets: [["@babel/typescript"]],

          plugins: [
            "@babel/proposal-class-properties",

            "@babel/proposal-object-rest-spread",
          ],
        },
      },
    ],
  },

  stats: {
    colors: true,
  },

  // target: 'web',

  externals: /k6(\/.*)?/,

  devtool: "source-map",
};
