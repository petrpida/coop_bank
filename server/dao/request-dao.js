"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "..", "storage", "requests.json");

class RequestDao {
  constructor(storagePath) {
    this.requestStoragePath = storagePath
      ? storagePath
      : DEFAULT_STORAGE_PATH;
  }

  async createRequest(request) {
    let requestList = await this._loadAllRequests();
    request.id = crypto.randomBytes(8).toString("hex");
    requestList.push(request);
    await wf(
      this._getStorageLocation(),
      JSON.stringify(requestList, null, 2)
    );
    return request;
  }

  async getRequest(id) {
    let request = await this._loadAllRequests();
    return request.find((b) => b.id === id);
  }

  async updateRequest(request) {
    let requestList = await this._loadAllRequests();
    const requestIndex = requestList.findIndex(
      (b) => b.id === request.id
    );
    if (requestIndex < 0) {
      throw new Error(
        `request with given id ${request.id} does not exists`
      );
    } else {
      requestList[requestIndex] = {
        ...requestList[requestIndex],
        ...request,
      };
    }
    await wf(
      this._getStorageLocation(),
      JSON.stringify(requestList, null, 2)
    );
    return requestList[requestIndex];
  }

  async deleteRequest(id) {
    let requestList = await this._loadAllRequests();
    const requestIndex = requestList.findIndex((b) => b.id === id);
    if (requestIndex >= 0) {
      requestList.splice(requestIndex, 1);
    }
    await wf(
      this._getStorageLocation(),
      JSON.stringify(requestList, null, 2)
    );
    return {};
  }

  async listRequests() {
    return await this._loadAllRequests();
  }

  async _loadAllRequests() {
    let requestList;
    try {
      console.log(this._getStorageLocation())
      requestList = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.code === "ENOENT") {
        console.info("No storage found, initializing new one...");
        requestList = [];
      } else {
        throw new Error(
          "Unable to read from storage. Wrong data format. " +
            this._getStorageLocation()
        );
      }
    }
    return requestList;
  }

  _getStorageLocation() {
    return this.requestStoragePath;
  }
}

module.exports = RequestDao;
