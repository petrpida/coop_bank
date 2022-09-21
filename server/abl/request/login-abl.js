const UserDao = require("../../dao/user-dao");
const path = require("path");
const Ajv = require("ajv").default;
const dao = new UserDao(
    path.join(__dirname, "..", "..", "storage", "users.json")
);

const schema = {
  type: "object",
  properties: {
    authorization: {type: "string", pattern: '^Basic (.*)$'},
  },
  required: ["authorization"],
};

async function LoginAbl(req, res) {
  try {
    const ajv = new Ajv({useDefaults: 'empty'});
    const headers = req.headers;
    const valid = ajv.validate(schema, headers);

    if (valid) {
      const auth = headers.authorization
      const userdata = auth.split(" ")[1]
      const userpwd = Buffer.from(userdata, 'base64').toString();
      const userarray = userpwd.split(":")
      const user = await dao.getByLogin(userarray[0])
      if (!user || user.password !== userarray[1]) {
        res
            .status(401)
            .send({ error: `username or password incorrect` });
      } else {
        res.send({
          login: user.login,
          name: user.name,
          roles: user.roles,
          token: user.token
        })
      }
    } else {
      res.status(401).send({
        errorMessage: "wrong Authorization header"
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e.stack);
  }
}

module.exports = LoginAbl;
