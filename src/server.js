require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const { ResponseHelper } = require("./utils");

// notes
const notes = require("./api/notes");
const NotesService = require("./services/postgres/NotesService");
const NotesValidator = require("./validator/notes");

// user
const users = require("./api/users");
const UsersService = require("./services/postgres/UsersService");
const UserValidator = require("./validator/users");

// authentications
const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/postgres/AuthenticationsService");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentications");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // External plug-in
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // Defined strategy authentication jwt
  server.auth.strategy("notes_app_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: notes,
      options: {
        service: new NotesService(),
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: new UsersService(),
        validator: UserValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService: new AuthenticationsService(),
        usersService: new UsersService(),
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  // Error handler (Rest Advice)
  server.ext("onPreResponse", (request, h) => {
    const { response } = request;
    if (response instanceof Error) {
      return ResponseHelper.error(h, response);
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
