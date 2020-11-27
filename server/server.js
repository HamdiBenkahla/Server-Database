const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fileupload = require("express-fileupload")
const file = require("./routes/upload.js");
require("dotenv").config();

app.use(fileupload({useTempFiles: true}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const auth = require('./Middleware/auth.jwt.js')
const car = require('./routes/car.js')
const driver = require('./routes/drivers.js')
const passenger = require('./routes/passengers.js')
const ride = require('./routes/rides.js')
const feedback = require('./routes/feedback.js')

app.use("/file",file)
app.use("/car", car);
app.use("/passenger", passenger);
app.use("/driver", driver);
app.use("/ride", ride);
app.use('/feedback', feedback);


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
  });
 //errors