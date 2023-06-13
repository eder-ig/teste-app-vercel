const dotenv = require("dotenv");
// const env = dotenv.config({ path: ".env" }).parsed;
const env = dotenv.config({ path: "../client/.env" }).parsed;
const { version } = require("./package.json");

process.env.VUE_APP_VERSION = version;
process.env.VUE_NODE_ENV = env.NODE_ENV;

process.env.VUE_APP_HOST = env.APP_HOST;
process.env.VUE_APP_PORT = env.APP_PORT;

module.exports = {
  transpileDependencies: ["vuetify"],
  outputDir: "dist",
};
