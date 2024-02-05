const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "skinnerjs.bundle.js",
    library: "SkinnerJs",
    libraryTarget: "umd",
  },

  mode: "production",
};
