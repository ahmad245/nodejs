const mongoose=require('mongoose');
  const {User}= require('./user');
require('mongoose-currency').loadType(mongoose);
const Currency=mongoose.Types.Currency;

const commentSchema=new mongoose.Schema({
    rating:{  type:Number, required:true,min:1,max:5},

    comment:{ type:String,required:true},

    // author:{type:String,required:true,}
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
},

    {timestamps:true});

const dishSchema=new mongoose.Schema({
    name:{type:String,unique:true,required:true},

    description:{type:String,require:true},

    image:{type:String,require:true},

    category:{type:String,require:true},

    lable:{type:String,default:''},

    price:{type:Currency,required:true,min:0},

    featured:{type:Boolean,default:false},
    
    comments:[commentSchema]
},{timestamps:true});

// const Comment=mongoose.model('comment',commentSchema);
const Dish=mongoose.model('dish',dishSchema);

module.exports.Dish=Dish;
// module.exports.Comment=Comment;
