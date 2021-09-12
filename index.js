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
  "mongodb+srv://ravi:ravi@dino.m8fqt.mongodb.net/dino?retryWrites=true&w=majority"
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

const AuthMiddleWare = async (req, res, next) => {
  if (isNullOrUndefined(req.session) || isNullOrUndefined(req.session.userId)) {
    res.status(401).send({ err: `Not Logged In` });
  } else {
    next();
  }
};

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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await userModel.findOne({ email });

  if (isNullOrUndefined(existingUser)) {
    res.status(401).send({ err: `EmailID doesn't exist` });
  } else {
    const hashedPwd = existingUser.password;
    if (bcrypt.compareSync(password, hashedPwd)) {
      req.session.userId = existingUser._id;
      req.session.email = existingUser.email;
      req.session.name = existingUser.userName;
      res.send(`Successfully loggedIn`);
    } else {
      res.status(401).send({ err: `Password is incorrect` });
    }
  }
});

app.get("/logout", (req, res) => {
  if (!isNullOrUndefined(req.session)) {
    req.session.destroy(() => {
      res.sendStatus(200);
    });
  } else {
    res.sendStatus(200);
  }
});

app.get("/userInfo", AuthMiddleWare, async (req, res) => {
  const user = await userModel.findById(req.session.userId);
  res.send({ email: user.email });
});

app.get("/profile", AuthMiddleWare, async (req, res) => {
  const userId = req.session.userId;
  const currUser = await userModel.findOne({ _id: userId });

  res.send(currUser);
});

app.put("/profile", AuthMiddleWare, async (req, res) => {
  const userId = req.session.userId;

  const { userName, dob, sex, country, phNum } = req.body;

  const currUser = await userModel.findOne({ _id: userId });

  currUser.userName = userName;
  currUser.dob = dob;
  currUser.sex = sex;
  currUser.country = country;
  currUser.phNum = phNum;

  await currUser.save();
  res.sendStatus(201);
});

app.get("/", (req, res) => {
  res.send("Working");
});

app.listen(9999, () => {
  console.log("server started");
});
