const { ResponseHelper } = require("../../utils");

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const { username, password, fullname } = request.payload;
    const userId = await this._service.save({
      username,
      password,
      fullname,
    });
    return ResponseHelper.created(h, { userId }, "User berhasil ditambahkan");
  }

  async getUserByIdHandler(request, h) {
    let user = await this._service.findById(request.params?.id);
    user = {
      id: user.id,
      username: user.username,
      fullname: user.fullname,
    };
    return ResponseHelper.ok(h, { user });
  }
}

module.exports = UsersHandler;
