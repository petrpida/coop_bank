const Ajv = require("ajv").default;

const schema = {
  type: "object",
  properties: {
    amount: {type: "number"},
    numOfMonths: {type: "number"}
  },
  required: ["amount", "numOfMonths"],
};

async function CalculateAbl(req, res) {
  try {
    const ajv = new Ajv({useDefaults: 'empty'});
    const values = req.body;
    const valid = ajv.validate(schema, values);

    const {amount, numOfMonths} = values
    const interest = 9
    const RPSN = 11
    const overall = Math.ceil(amount * 1.11)
    const monthly = Math.ceil(overall / numOfMonths)
    if (valid) {
        const result = {
          monthlyPayment: monthly,
          yearlyInterest: interest,
          RPSN: RPSN,
          overallAmount: overall,
          fixedFee: values.amount > 200000 ? 2000 : 0
        }
      res.status(200).send(result)
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: req.body,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e.stack);
  }
}

module.exports = CalculateAbl;
