const { ImageHeaderSchema } = require("./schema");
const InvariantException = require("../../exceptions/InvariantException");

const UploadValidator = {
  validateImageHeaders: (headers) => {
    const { error } = ImageHeaderSchema.validate(headers);

    if (error) {
      throw new InvariantException(error.message);
    }
  },
};

module.exports = UploadValidator;
