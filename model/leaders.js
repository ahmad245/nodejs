const mongoose=require('mongoose');

const leaderSchema=new mongoose.Schema({
    name:{type:String,unique:true,required:true},
    description:{type:String,require:true},
    image:{type:String,require:true},
    abbr:{type:String,default:''},
    designation:{type:String,require:true},
},{timestamps:true});
const Leader=mongoose.model('Leader',leaderSchema);
module.exports.Leader=Leader;

