const mongoose = require('mongoose');

const MailSchema = new mongoose.Schema(
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

const MailList = mongoose.model('MailList' , MailSchema)

module.exports = MailList;
