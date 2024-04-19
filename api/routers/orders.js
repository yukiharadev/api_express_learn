const express = require("express");
const router = express.Router();


const OrdersController = require("../controllers/orders");
const checkAuth = require("../middleware/check-auth");
//Handle incoming GET Requests to /orders
router.get("/", OrdersController.order_get_all );

router.post("/", checkAuth,OrdersController.order_post );

router.get("/:orderId", checkAuth, OrdersController.order_get_id );


router.delete("/:orderId",checkAuth , OrdersController.order_delete );

module.exports = router;
