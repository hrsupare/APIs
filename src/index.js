const { request } = require("express")
const express = require("express")
const bodyparser = express.json()
const mongoose = require("mongoose")
const router = express.Router()
const app = express()
const route = require("./route/route")
const cors = require("cors")


app.use(bodyparser)
app.use(cors())

mongoose
    .connect(
        "mongodb+srv://hsupare:2kZE1zdHBT5kzVVm@cluster0.5drhi.mongodb.net/himanshu-DB",
        { useNewUrlParser: true }
    )
    .then(() => console.log("MongoDb is connected"))
    .catch((err) => console.log(err));

app.use("/", route);


app.listen(process.env.PORT || 5000, () => {
    console.log("express in running on PORT " + (process.env.PORT || 5000))
}
)

