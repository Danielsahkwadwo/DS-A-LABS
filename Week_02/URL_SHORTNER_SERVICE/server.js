const app = require("./app");

const PORT = 3000;

//create express server
app.listen(PORT, () => {
  console.log(`server connected on port ${PORT}`);
});
