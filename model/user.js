const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const userSchema=new mongoose.Schema({
 
    firstname: {
        type: String,
          default: ''
      },
      lastname: {
        type: String,
          default: ''
      },
    admin:{
        type:Boolean,
        default:false
    }
});
userSchema.plugin(passportLocalMongoose);
const User=mongoose.model('user',userSchema);


module.exports.User=User;

   // username:{
    //     type:String,
    //     required:true,
    // },
    // password:{
    //     type:String,
    //     required:true
    // },