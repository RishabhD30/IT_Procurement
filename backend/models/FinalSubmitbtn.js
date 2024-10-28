const mongoose = require('mongoose');

const FinalSchema = new mongoose.Schema(
    {
        itemcode :{
            type : String , 
            required : true,
        },
        desc : {
            type: String,
            required : true,
        },
        qty : {
            type : Number,
            required : true
        }
    },{timestamp:true});

const FinalList = mongoose.model('FinalList' , FinalSchema)

module.exports = FinalList;
