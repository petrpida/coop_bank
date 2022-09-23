const path = require("path");
const RequestDao = require("../../dao/request-dao");
const getToken = require("../getToken");
const UserDao = require("../../dao/user-dao");
const dao = new RequestDao(
    path.join(__dirname, "..", "..", "storage", "requests.json")
);
const userDao = new UserDao();

async function ListAbl(req, res) {
    try {
        const token = getToken(req, res)
        if (!token) return
        const user = await userDao.getByToken(token)
        if (!user) {
            res.status(401).send({error: 'unknown user token'})
            return
        }

        const requestList = await dao.listRequests();

        const result = requestList.map(el => ({
            id: el.id,
            amount: el.amount,
            numOfMonths: el.numOfMonths,
            position: el.position,
            status: el.status,
            created: el.created,
            name: el.name,
            surname: el.surname,
            companyName: el.companyName,
            applicantType: el.applicantType
        }))

        res.json(result);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

module.exports = ListAbl;
