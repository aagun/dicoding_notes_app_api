const { ResponseHelper } = require("../../utils");

class UploadHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postUploadImageHandler(request, h) {
    const { data } = request.payload;

    this._validator.validateImageHeaders(data.hapi.headers);

    const filename = await this._service.writeFile(data, data.hapi);
    // const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

    return ResponseHelper.created(
      h,
      { fileLocation: filename.Location },
      "Gambar berhasil diunggah"
    );
  }
}

module.exports = UploadHandler;
