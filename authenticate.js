
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;

const {User}=require('./model/user');
const config=require('./config');
const {Dish,Comment}=require('./model/dish');
const jwt=require('jsonwebtoken');
const JwtStrategy=require('passport-jwt').Strategy;
const JwtExtract=require('passport-jwt').ExtractJwt;


exports.local=passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.getToken=function(user){
    return jwt.sign(user,config.secretKey,{expiresIn:36000});
}


let opts={}
opts.jwtFromRequest=JwtExtract.fromAuthHeaderAsBearerToken();
opts.secretOrKey=config.secretKey;

exports.jwtPassport=passport.use(new JwtStrategy(opts,
    (jwt_payload,done)=>{
        console.log('Jwt Payload',jwt_payload);
        User.findOne({_id:jwt_payload._id},(err,user)=>{
            if(err){
                return done(err,false);
            }
            else if(user){return done(null,user);}
            else{return done(null,false);}
        })
       }
    )
);
exports.verifyUser=passport.authenticate('jwt',{session:false});
exports.veryFyAdmin=(req,res,next)=>
{
    
    if(!req.user.admin) return res.status(403).send('access denied');
    next();
}
// function requireAdmin() {
//     return function(req, res, next) {
//       User.findOne({ req.body.username }, function(err, user) {
//         if (err) { return next(err); }
  
//         if (!user) { 
//           // Do something - the user does not exist
//         }
  
//         if (!user.admin) { 
//           // Do something - the user exists but is no admin user
//         }
  
//         // Hand over control to passport
//         next();
//       });
//     }
//   }