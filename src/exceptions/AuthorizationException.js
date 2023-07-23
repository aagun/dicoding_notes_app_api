const ClientException = require("./ClientException");

class AuthorizationException extends ClientException {
  constructor(message) {
    super(message, 403);
    this.name = "AuthorizationException";
  }
}

module.exports = AuthorizationException;
