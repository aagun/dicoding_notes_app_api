const { ResponseHelper } = require("../../utils");

class ExportHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postExportNotesHandler(request, h) {
    this._validator.validateExportNotesPayload(request.payload);
    const message = {
      targetEmail: request.payload.targetEmail,
      userId: request.auth.credentials.id,
    }
    await this._service.sendMessage('export:notes', message);
    return ResponseHelper.created(h, null, 'Permintaan Anda dalam antrean');
  }

}

module.exports = ExportHandler;
