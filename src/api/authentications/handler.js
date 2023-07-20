const { ResponseHelper } = require("../../utils");

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;
  }

  async postAuthenticationHandler(request, h) {
    await this._validator.validatePostAuthenticationPayload(request.payload);

    const { username, password } = request.payload;
    const id = await this._usersService.verifyUserCredential(
      username,
      password
    );

    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authenticationsService.saveRefreshToken(refreshToken);

    return ResponseHelper.created(
      h,
      { accessToken, refreshToken },
      "Authentication berhasil ditambahkan"
    );
  }

  async putAuthenticationHandler(request, h) {
    await this._validator.validatePutAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const id = this._tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this._tokenManager.generateAccessToken({ id });

    return ResponseHelper.ok(h, { accessToken });
  }

  async deleteAuthenticationHandler(request, h) {
    await this._validator.validateDeleteAuthenticationPayload(request.payload);
    const { refreshToken } = request.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);
    return ResponseHelper.ok(h, "Refresh token berhasil dihapus");
  }
}

module.exports = AuthenticationsHandler;
