const UploadHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "uploads",
  version: "1.0.0",
  register: async function (server, { service, validator }) {
    const uploadHandler = new UploadHandler(service, validator);
    server.route(routes(uploadHandler));
  },
};
