const { ResponseHelper } = require("../../utils");

class NotesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postNoteHandler(request, h) {
    this._validator.validateNotePayload(request.payload);

    const { title = "untitle", tags, body } = request.payload;
    const noteId = await this._service.addNote({ title, tags, body });

    return ResponseHelper.created(
      h,
      { noteId },
      "Catatan berhasil ditambahkan"
    );
  }

  async getNotesHandler(_, h) {
    const notes = await this._service.getNotes();
    return ResponseHelper.ok(h, { notes });
  }

  async getNoteByIdHandler(request, h) {
    const { id } = request.params;
    const note = await this._service.getNoteById(id);
    return ResponseHelper.ok(h, { note });
  }

  async putNoteByIdHandler(request, h) {
    this._validator.validateNotePayload(request.payload);
    const note = await this._service.editNoteById(
      request.params?.id,
      request.payload
    );
    return ResponseHelper.ok(h, { note }, "Catatan berhasil diperbarui");
  }

  async deleteNoteByIdHandler(request, h) {
    const note = await this._service.deleteNote(request.params?.id);
    return ResponseHelper.ok(h, { note }, "Catatan berhasil dihapus");
  }
}

module.exports = NotesHandler;
