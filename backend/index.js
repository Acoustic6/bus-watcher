const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

const sites = [
  {
    siteId: 1658,
    siteName: "Электрический пер.",
    longitude: 37.577,
    latitude: 55.773,
  },
];

app.get("/api/sites", (req, res) => {
  res.json(sites);
});

app.listen(9001, () => {
  console.log("Node server started on port 9001.");
});
