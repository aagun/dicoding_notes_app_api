const InvariantException = require("../../exceptions/InvariantException");
const { CollaborationPayloadSchema } = require("./schema");

const CollaborationValidator = {
  validateCollaborationPayload: (payload) => {
    const { error } = CollaborationPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantException(error.message);
    }
  },
};

module.exports = CollaborationValidator;
