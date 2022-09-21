const path = require("path");
const RequestDao = require("../../dao/request-dao");
let dao = new RequestDao(
    path.join(__dirname, "..", "..", "storage", "requests.json")
);

async function ListAbl(req, res) {
    try {
        const requestList = await dao.listRequests();

        const result = requestList.map(el => ({
            id: el.id,
            amount: el.amount,
            numOfMonths: el.numOfMonths,
            position: el.position,
            status: el.status,
            created: el.created
        }))

        res.json(result);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

module.exports = ListAbl;
