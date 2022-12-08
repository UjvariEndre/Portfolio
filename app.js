const express = require('express');

const app = express();

app.get("/", function(req, res) {
  res.send("Hello");
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`portfolio: listening on port ${port}`);
});
