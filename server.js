const app = require("./app");
const mongoose = require("mongoose");

const { DB_URI } = process.env;

mongoose
  .connect(DB_URI)
  .then(() => {
    app.listen(8080, () => {
      console.log("Connected to MongoDB");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
