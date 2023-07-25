const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantException = require("../../exceptions/InvariantException");
const NotFoundException = require("../../exceptions/NotFoundException");
const AuthenticationException = require("../../exceptions/AuthenticationException");

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async save({ username, password, fullname }) {
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id",
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantException("User gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async findById(id) {
    const query = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundException("User tidak ditemukan");
    }

    return result.rows[0];
  }

  async verifyNewUsername(username) {
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantException(
        "Gagal menambahkan user. Username sudah digunakan."
      );
    }
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: "SELECT id, password FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationException("Kredensial yang Anda berikan salah");
    }

    const { id, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationException("Kredensial yang Anda berikan salah");
    }

    return id;
  }

  async findByUsername(username) {
    const query = {
      text: "SELECT id, username, fullname FROM users WHERE username LIKE '%'||$1||'%'",
      values: [username],
    };

    const { rows = [] } = await this._pool.query(query);
    return rows;
  }
}

module.exports = UsersService;
