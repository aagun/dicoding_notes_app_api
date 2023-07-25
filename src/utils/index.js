const ClientException = require("../exceptions/ClientException");

const mapDBToModel = ({
  id,
  title,
  body,
  tags,
  created_at,
  updated_at,
  username,
}) => ({
  id,
  title,
  body,
  tags,
  createdAt: created_at,
  updatedAt: updated_at,
  username,
});

const ResponseHelper = {
  ok: (h, data, message = null) => {
    return h
      .response({
        status: "success",
        message,
        data,
      })
      .code(200);
  },
  created: (h, data, message) => {
    return h
      .response({
        status: "success",
        message,
        data,
      })
      .code(201);
  },
  error: (h, error) => {
    if (error instanceof ClientException) {
      return h
        .response({
          status: "fail",
          message: error.message,
        })
        .code(error.statusCode);
    }

    const { statusCode, error: message } = error.output.payload;
    if (statusCode.toString().startsWith(4)) {
      return h
        .response({
          status: "fail",
          message,
        })
        .code(statusCode);
    }

    console.error(error);
    return h
      .response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      })
      .code(500);
  },
};

module.exports = { mapDBToModel, ResponseHelper };
