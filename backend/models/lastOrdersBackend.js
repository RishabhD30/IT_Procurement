const mongoose = require('mongoose');

const PriceSubmitSchema = new mongoose.Schema({
    // userID: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref : 'UserModel'
    // },
    productID : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'productModel'
    },
    venderSubmitID:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'VenderSubmit'
    },
    price: {
        type : Number ,
        required : true
    },
    email : {
        type : String ,
        required : true
    }
});
const VenderPriceSubmit = mongoose.model('LastOrder', PriceSubmitSchema);
module.exports = VenderPriceSubmit;