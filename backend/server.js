const express = require("express");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const salesforceRoutes = require("./routes/salesforce");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500", "https://salesforce-validation-manager-frontend-kyu8.onrender.com"],
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    secret: "salesforce-validation-manager",
    resave: false,
    saveUninitialized: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Salesforce Validation Rule Manager Backend Running...");
});

app.use("/api/salesforce", salesforceRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
