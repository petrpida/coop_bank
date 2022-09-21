const express = require("express");
const router = express.Router();

// const CreateAbl = require("../abl/request/create-abl");
const GetAbl = require("../abl/request/get-abl");
// const UpdateAbl = require("../abl/request/update-abl");
// const DeleteAbl = require("../abl/request/delete-abl");
const ListAbl = require("../abl/request/list-abl");
const CalculateAbl = require("../abl/request/calculate-abl");
const CreateAbl = require("../abl/request/create-abl");
const UpdateAbl = require("../abl/request/update-abl");
const CancelAbl = require("../abl/request/cancel-abl");
const ApproveAbl = require("../abl/request/approve-abl");
const DeleteAbl = require("../abl/request/delete-abl");

router.post("/calculate", async (req, res) => {
  await CalculateAbl(req, res)
});


router.post("/create", async (req, res) => {
  await CreateAbl(req, res)
});

router.get("/list", async (req, res) => {
  await ListAbl(req, res);
});

router.put("/:id/cancel", async (req, res) => {
  await CancelAbl(req, res);
});

router.put("/:id/approve", async (req, res) => {
  await ApproveAbl(req, res);
});

router.get("/:id", async (req, res) => {
  await GetAbl(req, res);
});

router.put("/:id", async (req, res) => {
  await UpdateAbl(req, res);
});

router.delete("/:id", async (req, res) => {
  await DeleteAbl(req, res);
});


module.exports = router;
