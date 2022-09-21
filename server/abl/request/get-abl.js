const path = require("path");
const RequestDao = require("../../dao/request-dao");
let dao = new RequestDao(
  path.join(__dirname, "..", "..", "storage", "requests.json")
);

async function GetAbl(req, res) {
  try {
    const id = req.params.id

    const request = await dao.getRequest(id);
    if (!request) {
      res
        .status(404)
        .send({ error: `request with id '${id}' not found` });
    }
    res.json(request);
  } catch (e) {
    res.status(500).send(e);
  }
}

module.exports = GetAbl;
