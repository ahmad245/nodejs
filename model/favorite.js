const mongoose=require('mongoose');

const favoriteSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    dish:[{type: mongoose.Schema.Types.ObjectId,ref:'dish'}]
},{timestamps:true});

const Favorite=mongoose.model('favorite',favoriteSchema);

module.exports.Favorite=Favorite;