const AWS = require("aws-sdk");

class StorageService {
  constructor() {
    this._S3 = new AWS.S3();
  }

  writeFile(file, meta) {
    const parameters = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: +new Date() + meta.filename,
      Body: file._data,
      ContentType: meta.headers["content-type"],
    };

    return this._S3.upload(parameters).promise();
  }
}

module.exports = StorageService;
