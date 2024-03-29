const models = require("../models");

async function userShouldExist(req, res, next) {
  const { id } = req.params;
  try {
    const user = await models.User.findOne({
      where: {
        id,
      },
    });
    console.log(user);
    if (user) {
      next();
    } else res.status(404).send({ message: "User was not found" });
  } catch (err) {
    res.status(500).send(err);
  }
}

module.exports = userShouldExist;
