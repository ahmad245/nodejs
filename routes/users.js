var express = require('express');
const passport=require('passport');
const bodyParser=require('body-parser');


const {User}=require('../model/user');
const authenticate=require('../authenticate');
const cors = require('./cors');


var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/',cors.corsWithOptions, authenticate.verifyUser,authenticate.veryFyAdmin,(req,res,next)=>{
    User.find({}).then((users)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(users);
     },(err)=>next(err)).catch((err)=>next(err));
})
router.post('/sign-up',cors.corsWithOptions, (req, res, next)=> {
  User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if(req.body.firstname)
      {
     user.firstname=req.body.firstname;
      }
      if(req.body.lastname){
       user.lastname=req.body.lastname;
      }
      user.save((err,user)=>{
        if(err){
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      })
     
    }
  });
});

router.post('/login',cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
  let token=authenticate.getToken({_id:req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true,infoId:req.user._id, token:token, status: 'You are successfully logged in!'});
});


router.get('/logout',cors.corsWithOptions,(req,res,next)=>{
  if(req.session)
  {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err=new Error('You Are Not Login');
    err.status=403;
    return next(err);
  }
})

module.exports = router;




// var express = require('express');
// const bodyParser=require('body-parser');
// const {User}=require('../model/user');
// var router = express.Router();
// router.use(bodyParser.json());

// /* GET users listing. */
// router.post('/sign-up',(req, res, next)=> {
//   User.findOne({username:req.body.username}).
//   then((user)=>{
//     if(user!=null)
//     {
//       let err=new Error('You Are Already exist');
//       res.statusCode=403;
//        next(err);
//     }
//     else{
//       return  User.create({username:req.body.username,password:req.body.password});
//     }
//   }).then((user)=>{
//     res.statusCode=200;
//     res.setHeader('content-Type','application/json');
//     res.json({status:'Regestered Successfull',user:user})
//   },(err)=>next(err)).
//   catch((err)=>next(err))
// });

// router.post('/login',(req,res,next)=>{
//   if(!req.session.user)
//   {
//     let authHeader=req.headers.authorization;

//     if(!authHeader){
//               let err=new Error('you are not authorization')
//               res.setHeader('WWW-Authentication','Basic');
//               err.status=401;
//               return next(err);
//     }
//     else{
//         let auth=new Buffer(authHeader.split(' ')[1],'base64').toString().split(':');
//         let username=auth[0];
//         let password=auth[1];
//         User.findOne({username:username}).
//           then((user)=>{
//                         if(user==null){
//                             let err=new Error('you are not authorization')
//                             res.setHeader('WWW-Authentication','Basic');
//                             err.status=401;
//                             next(err);
//                         }else if(user.password!==password)
//                                 {
//                                   let err=new Error('Your Password not correct')
//                                   res.setHeader('WWW-Authentication','Basic');
//                                   err.status=403;
//                                   next(err);
//                         }else if(user.username===username&&user.password===password)
//                               {
//                                     req.session.user='authenticated';
//                                     res.statusCode=200;
//                                     res.setHeader('content-Type','text/plain');
//                                     res.end('You Are Authenticated')
//                                 }
          
//                          }).catch((err)=>next(err));
//        }
//   }
//   else{
//     res.statusCode=200;
//     res.setHeader('content-Type','text/plain');
//     res.end('You Are Already Authenticated');
//   }
 
// });
// router.get('/logout',(req,res,next)=>{
//   if(req.session)
//   {
//     req.session.destroy();
//     res.clearCookie('session-id');
//     res.redirect('/');
//   }
//   else{
//     var err=new Error('You Are Not Login');
//     err.status=403;
//     return next(err);
//   }
// })

// module.exports = router;
