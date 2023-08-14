const InvariantError = require("../../exceptions/InvariantException");
const { ExportPayloadSchema } = require("./schema");

const ExportsValidator = {
  validateExportNotesPayload: (payload) => {
    const { error } = ExportPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

module.exports = ExportsValidator;
