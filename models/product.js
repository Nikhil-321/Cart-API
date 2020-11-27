const mongoose = require('mongoose');

const productImageBasePath = 'uploads/images'
const path = require('path')

const Schema = mongoose.Schema;


const productSchema = new Schema({
    name : {type : String , required : true},
    quantity : {type : Number , required : true},
    price : {type : Number , required : true},
    desc : {type : String , required : true},
    productImageName : {type : String}
})


productSchema.virtual('productImagePath').get(function(){
    if(this.productImageName != null){
        return path.join('/', productImageBasePath , this.productImageName)
    }
})

module.exports = mongoose.model('Product' , productSchema)
module.exports.productImageBasePath = productImageBasePath





