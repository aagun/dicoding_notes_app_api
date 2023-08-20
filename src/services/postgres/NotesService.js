const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const { mapDBToModel } = require("../../utils");
const NotFoundException = require("../../exceptions/NotFoundException");
const AuthorizationException = require("../../exceptions/AuthorizationException");

class NotesService {
  constructor(collaborationsService, cacheService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
    this._cacheService = cacheService;
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

    await this._cacheService.delete(`notes:${owner}`);
    return result.rows[0].id;
  }

  async getNotes(owner) {
    try {
      const result = await this._cacheService.get(`notes:${owner}`);
      return JSON.parse(result);
    } catch (error) {}

    const query = {
      text: ` SELECT notes.* 
              FROM notes
                LEFT JOIN collaborations colabs ON colabs.note_id = notes.id
              WHERE notes.owner = $1 OR colabs.user_id = $1`,
      values: [owner],
    };
    const result = await this._pool.query(query);
    const mappedResult = result.rows.map(mapDBToModel);

    await this._cacheService.set(
      `notes:${owner}`,
      JSON.stringify(mappedResult)
    );

    return mappedResult;
  }

  async getNoteById(id) {
    const query = {
      text: ` SELECT 
                notes.*,
                users.username
              FROM notes 
                LEFT JOIN users ON users.id = notes.owner 
              WHERE notes.id = $1`,
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

    await this._cacheService.delete(`notes:${result.rows[0].owner}`);

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

    await this._cacheService.delete(`notes:${result.rows[0].owner}`);

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

  async verifyNoteAccess(noteId, userId) {
    try {
      await this.verifyNoteOwner(noteId, userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      try {
        await this._collaborationsService.verifyCollaborator(noteId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = NotesService;
