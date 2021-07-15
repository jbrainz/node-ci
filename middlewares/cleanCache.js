const { clearedHash } = require("../services/cache")

module.exports = async (req, res, next) => {
  await next()
  clearedHash(req.user.id)
}
