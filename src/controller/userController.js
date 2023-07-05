const userModel = require("../model/userModel")
const jwt = require("jsonwebtoken")

const isValidData = (value) => {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true
}
const registerUser = async (req, res) => {
    const data = req.body
    const { firstName, lastName, email, password } = data
    console.log(firstName, lastName, email, password)
    try {


        if (!isValidData(firstName)) {
            return res.status(400).send({
                status: false,
                message: "please Enter Your First Name"
            })
        }
        if (!/^\s*[a-zA-Z ]{2,}\s*$/.test(firstName)) {
            return res.status(400).send({
                status: false,
                message: `Heyyy....! ${firstName} is not a valid first name`,
            });
        }
        data.firstName = firstName.trim().split(" ").filter((word) => word).join(" ");

        //Last Name Validation
        if (!isValidData(lastName)) {
            return res.status(400).send({
                status: false,
                message: "please Enter Your Last Name"
            })
        }
        if (!/^\s*[a-zA-Z ]{2,}\s*$/.test(lastName)) {
            return res.status(400).send({
                status: false,
                message: `Heyyy....! ${lastName} is not a valid Last name`,
            });
        }
        data.lastName = lastName.trim().split(" ").filter((word) => word).join(" ");


 
        //email Validation

        if (!isValidData(email)) {
            return res.status(400).send({
                status: false,
                message: "please Enter Your Email"
            })
        }
        if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email.trim())) {
            return res.status(400).send({
                status: false,
                message: `Heyyy....! ${email} is not a valid email`
            });
        }

        const dupEmail = await userModel.findOne({ email: email })
        if (dupEmail) {
            return res.status(400).send({
                status: false,
                message: `${email} email is Already Register`
            })
        }
        data.email = email.trim();
        console.log(dupEmail, "dupEmail")
        //validate PassWord
        if (!isValidData(password)) {
            return res.status(400).send({
                status: false,
                message: "please enter Password....!",
            });
        }
        if (!/^[a-zA-Z0-9@*&$#!]{8,15}$/.test(password)) {
            return res.status(400).send({
                status: false,
                message: "please enter valid password min 8 or max 15 digit",
            });
        }
        const createUser = await userModel.create(data)
        return res.status(201).send({ status: true, data: createUser, message: "Thanks for being awesome!!!! registration done successfully" })
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, message: err.message })

    }

}

const userlogin = async (req, res) => {
    const data = req.body
    const { userName, password } = data
    try {
        //userName Validation

        if (!isValidData(userName)) {
            return res.status(400).send({
                status: false,
                message: "please Enter Your Email as UserName"
            })
        }
        if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(userName)) {
            return res.status(400).send({
                status: false,
                message: `Heyyy....! ${userName} is not a valid Username`
            });
        }
        const findInDB = await userModel.findOne({ email: userName })
        if (!findInDB) {
            return res.status(404).send({
                status: false,
                message: `Heyyy....! ${userName} is not a Registered User`
            });
        }
        if (!isValidData(password)) {
            return res.status(400).send({
                status: false,
                message: "please Enter Your password"
            })
        }
        if (findInDB.password !== password) {
            return res.status(400).send({
                status: false,
                message: `Heyyy....!  Your Password Is wrong `
            });
        }
        const token = jwt.sign(
            {
                userId: findInDB._id,
                project: "APIs"
            }, "I-AM-A-KEY"
        )
        res.setHeader("I-AM-A-KEY", token)
        const info = {
            firstName: findInDB.firstName,
            lastName: findInDB.lastName,
            careerObjective: findInDB.careerObjective
        }


        return res.status(200).send({ status: true, message: "user Login Successfully", information: info, token: token })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = { registerUser, userlogin }