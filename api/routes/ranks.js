const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Rank = require('../models/rank');

router.get('/', (req, res, next) => {
    Product.find().exec().then((result) => {
        if (result) {
            res.status(200).json({
                length: result.length,
                products: result
            });
        } else {
            res.status(404).json({
                err: 'Not Found'
            });
        }
    }).catch((err) => {
        res.status(500).json({
            shorterror: 'Something went wrong',
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save().then((result) => {
        console.log(result);
        res.status(200).json({
            message: "Created product",
            product: product
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            message: "Error",
            error: err
        });
    });
});

router.get('/:productID', (req, res, next) => {
    const id = req.params.productID;
    Product.findById(id).exec().then((result) => {
        if (result) {
            res.status(200).json({
                product: result
            });
        } else {
            res.status(404).json({
                error: 'Product not found',
                reqId: id
            });
        }
    }).catch((err) => {
        res.status(500).json({
            shorterror: 'Invalid ID',
            error: err
        });
    });
});

router.patch('/:productID', (req, res, next) => {
    const id = req.params.productID;
    
    Product.updateOne({_id: id}, {
            name: req.body.name,
            price: req.body.price
        }).exec().then((result) => {
        res.status(200).json({
            message: "Product updated",
            reqId: id,
            newProduct: {
                name: req.body.name,
                price: req.body.price
            }
        });
    }).catch((err) => {
        res.status(500).json({
            error: err,
            reqId: id,
        })
    });
});

router.delete('/:productID', (req, res, next) => {
    const id = req.params.productID;
    Product.deleteOne({_id: id}).exec().then((result) => {
        res.status(200).json({
            message: "Product Deleted",
            reqId: id,
        });
    }).catch((err) => {
        res.status(500).json({
            error: err,
            reqId: id,
        })
    });
    
});

module.exports = router;