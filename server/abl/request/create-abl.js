const {APPLICANT_TYPES, REQUEST_STATUSES} = require("../../dao/request-constants");
const RequestDao = require("../../dao/request-dao");
const path = require("path");
const createAjv = require("../createAjv");
const dao = new RequestDao(
    path.join(__dirname, "..", "..", "storage", "requests.json")
);

const baseSchema = {
    type: "object",
    properties: {
        applicantType: {enum: Object.keys(APPLICANT_TYPES), notEmpty: true},
        name: {type: "string", notEmpty: true},
        surname: {type: "string", notEmpty: true},
        birthNum: {type: "string"},
        nationality: {type: "string"},
        email: {type: "string", notEmpty: true},
        phone: {type: "string"},
        IC: {type: "string"},
        position: {type: "string"},
        companyName: {type: "string"},
        amount: {type: "number"},
        numOfMonths: {type: "number"},
        address: {
            type: "object",
            properties: {
                street: {type: "string"},
                descNumber: {type: "number"},
                indicativeNumber: {type: "number"},
                city: {type: "string"},
                postalCode: {type: "number"}
            }
        }
    },
    required: ["applicantType", "name", "surname", "email"],
    additionalProperties: false
};

const individualSchema = {
    ...baseSchema,
    properties: {
        ...baseSchema.properties
    },
    required: [...baseSchema.required]
}
const osvcSchema = {
    ...baseSchema,
    properties: {
        ...baseSchema.properties,
        IC: {type: "string", notEmpty: true},
    },
    required: [...baseSchema.required, "IC"]
}
const legalSchema = {
    ...baseSchema,
    properties: {
        ...baseSchema.properties,
        IC: {type: "string", notEmpty: true},
        position: {type: "string", notEmpty: true},
    },
    required: [...baseSchema.required, "IC", "position"]
}

async function CreateAbl(req, res) {
    try {
        const ajv = createAjv();
        const input = req.body;

        if (!Object.keys(APPLICANT_TYPES).includes(input.applicantType)) {
            res.status(400).send({
                errorMessage: `unknown applicantType ${input.applicantType}`
            })
            return
        }

        if (input.address && input.address.descNumber%2 === 0) {
            res.status(400).send({
                errorMessage: `error - even descriptive number`
            })
            return
        }

        const applicantType = input.applicantType

        const schema = function(){
            switch(applicantType) {
                case APPLICANT_TYPES.INDIVIDUAL:
                    return individualSchema
                case APPLICANT_TYPES.OSVC:
                    return osvcSchema
                case APPLICANT_TYPES.LEGAL_ENTITY:
                    return legalSchema
            }
        }()

        const validate = ajv.compile(schema);
        const valid = validate(input)
        if (valid) {
            const request = {
                ...input,
                created: new Date(),
                status: REQUEST_STATUSES.PENDING
            }
            const result = await dao.createRequest(request)
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

module.exports = CreateAbl;
