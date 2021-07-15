require("../models/User")
jest.setTimeout(30000)
const keys = require("../config/keys")
const mongoose = require("mongoose")

mongoose.Promise = global.Promise

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(keys.mongoURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    console.log("Connected!")
  } catch (error) {
    console.log("Error:", error)
  }
}

connectDB()
