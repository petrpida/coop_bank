const {default: Ajv} = require("ajv");

function createAjv() {
    const ajv =  new Ajv()
    ajv.addKeyword('notEmpty', {
        type: 'string',
        validate: function (schema, data) {
            return typeof data === 'string' && data.trim() !== ''
        },
        errors: "full"
    })
    return ajv
}

module.exports = createAjv