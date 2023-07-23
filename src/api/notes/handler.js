const { ResponseHelper } = require("../../utils");

class NotesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postNoteHandler(request, h) {
    this._validator.validateNotePayload(request.payload);

    const { title = "untitle", tags, body } = request.payload;
    const { id: owner } = request.auth.credentials;
    const noteId = await this._service.addNote({ title, tags, body, owner });

    return ResponseHelper.created(
      h,
      { noteId },
      "Catatan berhasil ditambahkan"
    );
  }

  async getNotesHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const notes = await this._service.getNotes(owner);
    return ResponseHelper.ok(h, { notes });
  }

  async getNoteByIdHandler(request, h) {
    const { id } = request.params;
    const { id: owner } = request.auth.credentials;

    await this._service.verifyNoteOwner(id, owner);
    const note = await this._service.getNoteById(id);
    return ResponseHelper.ok(h, { note });
  }

  async putNoteByIdHandler(request, h) {
    this._validator.validateNotePayload(request.payload);
    const { id } = request.params;
    const { id: owner } = request.auth.credentials;
    await this._service.verifyNoteOwner(id, owner);
    const note = await this._service.editNoteById(id, request.payload);
    return ResponseHelper.ok(h, { note }, "Catatan berhasil diperbarui");
  }

  async deleteNoteByIdHandler(request, h) {
    const { id } = request.params;
    const { id: owner } = request.auth.credentials;
    await this._service.verifyNoteOwner(id, owner);
    const note = await this._service.deleteNoteById(id);
    return ResponseHelper.ok(h, { note }, "Catatan berhasil dihapus");
  }
}

module.exports = NotesHandler;
