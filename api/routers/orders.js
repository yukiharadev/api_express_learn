const express = require('express');

const router = express.Router();

//Handle incoming GET Requests to /orders
router.get('/',(req, res, next) =>{
    res.status(200).json({
        message: 'Order were'
    });
}) 

router.post('/',(req, res, next) =>{
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: 'Order was created',
        order: order
    });
}) 

router.post('/',(req, res, next) =>{
    res.status(201).json({
        message: 'Order was created'
    });
}) 

router.get('/:orderId',(req, res, next) =>{
    res.status(200).json({
        message: 'Order details',
        orderId: req.params.orderId
    });
}) 

router.delete('/:orderId',(req, res, next) =>{
    res.status(200).json({
        message: 'Order delete',
        orderId: req.params.orderId
    });
}) 


module.exports = router;