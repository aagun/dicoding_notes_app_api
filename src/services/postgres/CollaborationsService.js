const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantException = require("../../exceptions/InvariantException");

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async save(noteId, userId) {
    const id = `collab-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id",
      values: [id, noteId, userId],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length) {
      return rows[0].id;
    }

    throw new InvariantException("Kolaborasi gagal ditambahkan");
  }

  async delete(noteId, userId) {
    const query = {
      text: "DELETE FROM collaborations WHERE note_id = $1 AND user_id = $2 RETURNING id",
      values: [noteId, userId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new InvariantException("Kolaborasi gagal dihapus");
    }
  }

  async verifyCollaborator(noteId, userId) {
    const query = {
      text: "SELECT * FROM collaborations WHERE note_id = $1 AND user_id = $2",
      values: [noteId, userId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new InvariantException("Kolaborasi gagal diverifikasi");
    }
  }
}

module.exports = CollaborationsService;
