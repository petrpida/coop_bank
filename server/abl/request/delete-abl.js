const getToken = require("../getToken");
const UserDao = require("../../dao/user-dao");
const RequestDao = require("../../dao/request-dao");
const userDao = new UserDao();
const requestDao = new RequestDao();
const userConstants = require("../../dao/user-constants")

async function DeleteAbl(req, res) {
    try {
        const token = getToken(req, res)
        if (!token) return
        const user = await userDao.getByToken(token)
        if (!user) {
            res.status(401).send({error: 'unknown user token'})
            return
        }
        const roles = user.roles
        if (roles.find(r => userConstants.CAN_DELETE.includes(r))) {
            const id = req.params.id
            const result = await requestDao.deleteRequest(id)
            res.send(result)
        } else {
            res.status(401).send({error: `user ${user.name} not authorized for this operation`})
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e.stack);
    }
}


module.exports = DeleteAbl;
