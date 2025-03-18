const express = require("express");
const cors = require("cors");
// const bodyParser = require('body-parser');
const mongoose = require("mongoose");
require("dotenv").config();
const { fetchUserData } = require("./service/fetchUser");
const routes = require("./routes");

// DB connection
const MONGODB_URL = process.env.MONGODB_URL;
console.log(MONGODB_URL);
mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to %s", MONGODB_URL);
  })
  .catch((err) => {
    console.error("MongoDB connection starting error:", err.message);
    process.exit(1);
  });

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.use(cors());

app.use("/api", routes);

setInterval(fetchUserData, 1000 * 60 * 60 * 12);

const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log("Express server started on port: " + port);
});
