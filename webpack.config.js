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
  performance: {
    hints: false, // Disable performance hints
    maxEntrypointSize: 512000, // Adjust entry point size limit (in bytes)
    maxAssetSize: 512000, // Adjust asset size limit (in bytes)
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
  },
};
