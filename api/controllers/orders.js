const mongoose = require('mongoose')

const Order = require("../models/order");
const Product = require("../models/product");

exports.order_get_all = (req, res, next) => {
    Product.find()
      .select("name price _id productImage")
      .exec()
      .then((docs) => {
        const response = {
          count: docs.length,
          products: docs.map((doc) => {
            return {
              name: doc.name,
              price: doc.price,
              _id: doc._id,
              productImage : doc.productImage,
              request: {
                type: "GET",
                url: "http://localhost:3000/products/" + doc._id,
              },
            };
          }),
        };
        res.status(200).json(response);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  }

exports.order_post = (req, res, next) => {
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
  }

  exports.order_delete = (req, res, next) => {
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
}

exports.order_get_id = (req, res, next) => {
    Order.findById(req.params.orderId)
    .select('product quantity _id')
    .populate("product", "name price")
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
}