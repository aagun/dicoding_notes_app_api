const CollaborationsHandler = require("./handler");

module.exports = {
  name: "collaborations",
  version: "1.0.0",
  register: (server, { collaborationsService, notesService, validator }) => {
    const collaborationsHandler = new CollaborationsHandler(
      collaborationsService,
      notesService,
      validator
    );
    server.route(require("./routes")(collaborationsHandler));
  },
};
