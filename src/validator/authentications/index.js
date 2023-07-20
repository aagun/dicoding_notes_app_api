const InvariantException = require("../../exceptions/InvariantException");
const {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
} = require("./schema");

const AuthenticationsValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const { error } = PostAuthenticationPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantException(error.message);
    }
  },
  validatePutAuthenticationPayload: (payload) => {
    const { error } = PutAuthenticationPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantException(error.message);
    }
  },
  validateDeleteAuthenticationPayload: (payload) => {
    const { error } = DeleteAuthenticationPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantException(error.message);
    }
  },
};

module.exports = AuthenticationsValidator;
