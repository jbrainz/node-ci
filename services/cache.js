const mongoose = require("mongoose")
const { promisify } = require("util")
const redis = require("redis")
const keys = require("../config/keys")

const client = redis.createClient(keys.redisUrl)
client.hget = promisify(client.hget)
const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true
  this.hashKey = JSON.stringify(options.key || "")
  return this
}

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments)
  }
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  )
  //SEE IF WE HAVE A VALUE FOR 'KEY' IN REDIS
  const cachedValue = await client.hget(this.hashKey, key)
  //IF WE DO RETURN THAT
  if (cachedValue) {
    const doc = JSON.parse(cachedValue)
    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc)
  }
  const result = await exec.apply(this, arguments)
  client.hset(this.hashKey, key, JSON.stringify(result), "EX", 10)
  return result
}

module.exports = {
  clearedHash(hashKey) {
    client.del(JSON.stringify(hashKey))
  },
}
