const RequestDao = require("../../dao/request-dao");
const path = require("path");
const createAjv = require("../createAjv");
const dao = new RequestDao(
    path.join(__dirname, "..", "..", "storage", "requests.json")
);

const schema = {
    type: "object",
    properties: {
        amount: {type: "number"},
        numOfMonths: {type: "number"},
    },
    required: [],
    additionalProperties: false
};

async function UpdateAbl(req, res) {
    try {
        const id = req.params.id
        const ajv = createAjv();
        const input = req.body;

        const validate = ajv.compile(schema)
        const valid = validate(input)

        if (valid) {
            const request = await dao.getRequest(id)
            if (!request) {
                res.status(400).send({ error: `request with id '${id}' not found` })
                return
            }
            const result = await dao.updateRequest({...input, id})
            res.status(200).send(result)
        } else {
            res.status(400).send({
                errorMessage: "validation of input failed",
                params: validate.errors,
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e.stack);
    }
}

module.exports = UpdateAbl;
