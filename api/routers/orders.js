const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");
const { request } = require("../../app");

//Handle incoming GET Requests to /orders
router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((docs) => {
          return {
            _id: docs._id,
            product: docs.product,
            quantity: docs.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + docs._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  Product.findById(req.body.productId).then((product) => {
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    } else {
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order
        .save()
        .then((result) => {
          console.log(result);
          res.status(201).json({
            message: "Order stored",
            createdOrder: {
              _id: result._id,
              product: result.product,
              quantity: result.quantity,
            },
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + result._id,
            },
          });
        })
    }
  }).catch((err) => {
    res.status(500).json({
        error: err,
    });
  });
});

router.get("/:orderId", (req, res, next) => {
    Order.findById(req.params.orderId)
    .select('product quantity _id')
    .exec()
    .then((result) => {
       res.status(200).json({
        order: result,
        request:{
            type: "GET",
            url: "http://localhost:3000/orders/",
        }
       }) 
    }).catch(err => {
        res.status(500).json({
            error: err,
        })
    });
});

router.patch("/:orderId", (req, res, next) => {
    
})

router.delete("/:orderId", (req, res, next) => {
    Order.deleteMany({_id: req.params.orderId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Order deleted",
            request:{
                type: "POST",
                url: "http://localhost:3000/orders/",
                body:{
                    productId: 'ID',
                    quantity: 'Number'
                }
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err,
        })
    })
});

module.exports = router;
