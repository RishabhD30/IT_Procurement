const mongoose = require('mongoose');

const reqSchema = new mongoose.Schema(
    {
        productID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "productModel",
        },
        
    },{timestamp:true});

      

const reqModel = mongoose.model('reqModel' , reqSchema)

module.exports = reqModel;