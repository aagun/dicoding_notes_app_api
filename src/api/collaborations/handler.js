const { ResponseHelper } = require("../../utils");

class CollaborationsHandler {
  constructor(collaborationsService, notesService, validator) {
    this._collaborationsService = collaborationsService;
    this._notesService = notesService;
    this._validator = validator;
  }

  async postCollaborationHandler(request, h) {
    await this._validator.validateCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { noteId, userId } = request.payload;

    await this._notesService.verifyNoteOwner(noteId, credentialId);
    const collaborationId = await this._collaborationsService.save(
      noteId,
      userId
    );

    return ResponseHelper.created(
      h,
      { collaborationId },
      "Kolaborasi berhasil ditambahkan"
    );
  }

  async deleteCollaborationHandler(request, h) {
    await this._validator.validateCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { noteId, userId } = request.payload;

    await this._notesService.verifyNoteAccess(noteId, credentialId);
    await this._collaborationsService.delete(noteId, userId);
    return ResponseHelper.ok(h, null, "Kolaborasi berhasil dihapus");
  }
}

module.exports = CollaborationsHandler;
