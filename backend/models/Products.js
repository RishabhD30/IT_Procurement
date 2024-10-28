const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserModel",
        },
        desc : {
            type: String,    
        },
        itemcode:{
            type : String, 
        },
        image:{
            type: String,
        }
    },{timestamp:true});

const productModel = mongoose.model('productModel' , productSchema)

module.exports = productModel;



// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     "products":[
//         {
//             "itemcode":"35589585604",
//             "desc":"Dell latitude 3410 laptop",
//             "image" : "https://c1.neweggimages.com/ProductImageCompressAll1280/AA0SD210305MQORW.jpg"
//         },
//         {
//             "itemcode":"35589585604", 
//             "desc":"Dell latitude 3420 laptop12",
//             "image" : "https://media.karousell.com/media/photos/products/2022/2/22/dell_latitude_3420_i5_11th_gen_1645521398_e9939d65_progressive.jpg"
//         },
        
//     ]},{timestamps:true});

// const productModel = mongoose.model('productModel',productSchema)
// module.exports = productModel;