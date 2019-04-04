const mongoose=require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency=mongoose.Types.Currency;

const promoSchema=new mongoose.Schema({
    name:{type:String,unique:true,required:true},
    description:{type:String,require:true},
    image:{type:String,require:true},
    label:{type:String,default:''},
    price:{type:Currency,required:true,min:0},
},{timestamps:true});
const Promotion=mongoose.model('promotion',promoSchema);
module.exports.Promotion=Promotion;

