const ClientException = require("./ClientException");

class InvariantException extends ClientException {
  constructor(message) {
    super(message);
    this.name = "InvariantError";
  }
}

module.exports = InvariantException;
