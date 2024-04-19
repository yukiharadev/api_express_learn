const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");


const ProductControllers = require("../controllers/products");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});


const upload = multer({
  storage: storage,
});


const Product = require("../models/product");

router.get("/", ProductControllers.product_get_all );

router.post("/", checkAuth, upload.single("productImage"),ProductControllers.product_post );

router.get("/:productId", ProductControllers.product_get_id);

router.patch("/:productId", ProductControllers.product_update );

router.delete("/:productId", ProductControllers.product_delete);

module.exports = router;
