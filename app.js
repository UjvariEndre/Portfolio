const express = require("express");
const ejs = require("ejs");

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');

// Home
app.get("/", function(req, res) {
  res.render("home");
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`portfolio: listening on port ${port}`);
});
