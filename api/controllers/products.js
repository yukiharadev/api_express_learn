const mongoose = require("mongoose");

const Product = require("../models/product");

exports.product_get_all = (req, res, next) => {
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

  exports.product_post = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path,
    });
    product
      .save()
      .then((result) => {
        console.log(result);
        res.status(201).json({
          message: "Created product successfully",
          createProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + result._id,
            },
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  }

  exports.product_get_id = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
      .select("name price _id productImage")
      .exec()
      .then((doc) => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
            product: doc,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          });
        } else {
          res.status(404).json({
            message: "No valid found for provided ID",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  }

  exports.product_update = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({ _id: id }, { $set: updateOps })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "Updated product successfully",
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + id,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  }

  exports.product_delete =  (req, res, next) => {
    const id = req.params.productId;
    Product.deleteMany({ _id: id })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "Deleted product successfully",
          request: {
            type: "POST",
            url: "http://localhost:3000/products",
            body: {
              name: "String",
              price: "Number",
            },
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  }