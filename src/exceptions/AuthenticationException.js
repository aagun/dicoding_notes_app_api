const ClientException = require("./ClientException");

class AuthenticationException extends ClientException {
  constructor(message) {
    super(message, 401);
    this.name = "AuthenticationException";
  }
}

module.exports = AuthenticationException;
