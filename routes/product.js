const router = require('express').Router()
const Product = require('../models/product')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const uploadPath = path.join('public' , Product.productImageBasePath)
const imageMimeTypes = ['image/jpeg' , 'image/png' , 'images/gif']

// Multer configuration

const upload = multer({
    dest : uploadPath,
    fileFilter : (req , file , cb) =>{
        cb(null , imageMimeTypes.includes(file.mimetype))
    }  // we need to call this callback when we are actually done with our file here
    
})

router.get('/' , (req,res) =>{

    res.render('product')

})


router.post('/' , upload.single('image') , async (req,res) =>{

    const fileName = req.file != null ? req.file.filename : null
    const {name , quantity , price , desc} = req.body;

    if(!name , !quantity , !price , !desc){
        req.flash('error' , 'All fields are required')
        return res.redirect('/')
    }

    const product =  new Product({
        name,
        quantity,
        price,
        desc,
        productImageName : fileName
    })

    try{
        const newProduct = await product.save()
        res.redirect('/list')
    } catch(err){
        req.flash('error' , 'Something went wrong')
        return res.redirect('/')
    }
})



router.get('/list' , async (req,res) =>{
    const products = await Product.find({})

    res.render('productList' , {products : products})
})


router.get('/cart' , (req,res) =>{
    
    res.render('cart')
})



router.post('/update-cart' , (req,res) =>{


        // let cart = {
        //     items : {
        //     item : productId , qty : 0
        //     },
        //     totalPrice : 0,
        //     totaQty : 0
        // }

// Checking if there is cart in session and adding basic cart structure for the first time

        if(!req.session.cart){
            req.session.cart = {
                items : {},
                totalPrice : 0,
                totalQty : 0

            }
        }

        // console.log(req.body)

        let cart = req.session.cart

        // Check if item does not exist in cart

        if(!cart.items[req.body._id]){
            cart.items[req.body._id] = {
                item : req.body,
                qty : 1
            },
            cart.totalPrice = cart.totalPrice + req.body.price,
            cart.totalQty = cart.totalQty + 1
        } else{
            cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
            cart.totalQty = cart.totalQty + 1
            cart.totalPrice  = cart.totalPrice + req.body.price
        }

    return res.json({totalQty : req.session.cart.totalQty , imageName : req.session.cart.productImageName})
})


router.post('/reset' , (req,res) =>{
    req.session.cart = '';
    return res.redirect('/')
})


module.exports = router