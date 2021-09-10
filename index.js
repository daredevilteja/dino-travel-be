const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Working");
});

app.listen(9999, () => {
  console.log("server started");
});
