const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "/img-convert/" : "/",
  pages: {
    index: {
      entry: "src/main.js",
      title: "画像一括変換",
    },
  },
});
