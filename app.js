const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRouters = require("./api/routers/products");
const orderRouters = require("./api/routers/orders");
const userRouters = require("./api/routers/user")


mongoose.connect('mongodb://localhost:27017/node-rest-shop').then(() => console.log('Connected!'));

mongoose.Promise = global.Promise

app.use(morgan("dev"));
app.use("/uploads",express.static('uploads'))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//Routes which should handle requests
app.use("/products", productRouters);
app.use("/orders", orderRouters);
app.use("/user", userRouters);


app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
module.exports = app;
