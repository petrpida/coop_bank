"use strict";
const fs = require("fs");
const path = require("path");

const rf = fs.promises.readFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "..", "storage", "users.json");

class UserDao {
  constructor(storagePath) {
    this.userStoragePath = storagePath
      ? storagePath
      : DEFAULT_STORAGE_PATH;
  }

  async getByLogin(login) {
    const users = await this._loadAllUsers();
    return users.find((b) => b.login === login.trim());
  }

  async getByToken(token) {
    const users = await this._loadAllUsers();
    return users.find((b) => b.token === token);
  }

  async _loadAllUsers() {
    let userList;
    try {
      console.log(this._getStorageLocation())
      userList = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.code === "ENOENT") {
        console.info("No storage found, initializing new one...");
        userList = [];
      } else {
        throw new Error(
          "Unable to read from storage. Wrong data format. " +
            this._getStorageLocation()
        );
      }
    }
    return userList;
  }

  _getStorageLocation() {
    return this.userStoragePath;
  }
}

module.exports = UserDao;
