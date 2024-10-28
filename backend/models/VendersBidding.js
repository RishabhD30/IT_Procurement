const mongoose = require('mongoose');

const VenderBid = new mongoose.Schema(
    {
        finalListID :{
            type : mongoose.Schema.Types.ObjectId , 
            ref:'FinalList',
            required : true,
        },
        userID : {
            type : mongoose.Schema.Types.ObjectId , 
            ref:'UserModel',
            required : true,
        },
        price:{
            type: Number,
            required : true
        }
    },{timestamp:true});

const VenderPriceList = mongoose.model('VenderPriceList' , VenderBid)

module.exports = VenderPriceList;
