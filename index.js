const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");

const session_secret = "g63g3ix378772W&^";

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(
  session({
    secret: session_secret,
  })
);

const db = mongoose.createConnection(
  "mongodb+srv://ravi:ravi@dino.m8fqt.mongodb.net/Dino?retryWrites=true&w=majority"
);

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  dob: String,
  sex: String,
  country: String,
  phNum: Number,
});

const userModel = db.model("user", userSchema);
const SALT = 5;

const isNullOrUndefined = (val) => val === null || val === undefined;

app.post("/signup", async (req, res) => {
    const { userName, password, email, dob, sex, country, phNum } = req.body;
    const existingUser = await userModel.findOne({ email });

    if (isNullOrUndefined(existingUser)) {
        const hashedPwd = bcrypt.hashSync(password, SALT);
        const newUser = new userModel({
            userName,
            password: hashedPwd,
            email,
            dob,
            sex,
            country,
            phNum,
        });
        await newUser.save();

        req.session.userId = newUser._id;

        res.status(201).send("Signed Up");
    } else {
        res
            .status(409)
            .send({ err: `User with Email ID ${email} already exists.` });
    }
});

app.get("/", (req, res) => {
  res.send("Working");
});

app.listen(9999, () => {
  console.log("server started");
});
