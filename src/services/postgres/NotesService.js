const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const { mapDBToModel } = require("../../utils");
const NotFoundException = require("../../exceptions/NotFoundException");
const AuthorizationException = require("../../exceptions/AuthorizationException");

class NotesService {
  constructor() {
    this._pool = new Pool();
  }

  async addNote({ title, body, tags, owner }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    const query = {
      text: "INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, body, tags, createdAt, updatedAt, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantException("Catatan gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getNotes(owner) {
    const query = {
      text: "SELECT * FROM notes WHERE owner = $1",
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModel);
  }

  async getNoteById(id) {
    const query = {
      text: "SELECT * FROM notes WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundException("Catatan tidak ditemukan");
    }

    return result.rows.map(mapDBToModel)[0];
  }

  async editNoteById(id, { title, body, tags }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: "UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id",
      values: [title, body, tags, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundException(
        "Gagal memperbarui catatan. Id tidak ditemukan"
      );
    }

    return result.rows.map(mapDBToModel)[0];
  }

  async deleteNoteById(id) {
    const query = {
      text: "DELETE FROM notes WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundException("Catatan gagal dihapus. Id tidak ditemukan");
    }

    return result.rows.map(mapDBToModel)[0];
  }

  async verifyNoteOwner(id, owner) {
    const query = {
      text: "SELECT * FROM notes WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundException("Catatan tidak ditemukan");
    }

    const note = result.rows[0];

    if (note.owner !== owner) {
      throw new AuthorizationException(
        "Anda tidak berhak mengakses resource ini"
      );
    }
  }
}

module.exports = NotesService;
