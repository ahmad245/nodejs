const express=require('express');
const bodyParser=require('body-parser');

const authenticate=require('../authenticate');
const {Promotion}=require('../model/promotions');
const cors = require('./cors');

const promoRouter=express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    Promotion.find({}).then((promotions)=>{
       res.statusCode=200;
       res.setHeader('Content-Type','application/json');
       res.json(promotions);
   },(err)=>next(err)).catch((err)=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
   Promotion.create(req.body).then((promotion)=>{
       res.statusCode=200;
       res.setHeader('Content-Type','application/json');
       res.json(promotion);
   },(err)=>next(err)).catch((err)=>next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
   res.statusCode = 403;
   res.end('PUT operation not supported on /promotions');
})
.delete(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
   Promotion.remove({}).then((resp)=>{
       res.statusCode=200;
       res.setHeader('Content-Type','application/json');
       res.json(resp);
   },(err)=>next(err)).catch((err)=>next(err));
});
/////////////////////promoId//////////////////////////////////////
promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
   Promotion.findById(req.params.promoId).
   then((promotion)=>{
       res.statusCode=200;
       res.setHeader('Content-Type','application/json');
       res.json(promotion);
   },(err)=>next(err)).catch((err)=>next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
 res.statusCode = 403;
 res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})

.put(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
 Promotion.findByIdAndUpdate(req.params.promoId,{
     $set:req.body
 },{new:true})
 .then((promotion)=>{
   res.statusCode=200;
   res.setHeader('Content-Type','application/json');
   res.json(promotion);
},(err)=>next(err)).catch((err)=>next(err));
})

.delete(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
 Promotion.findByIdAndRemove(req.params.promoId).
 then((promotion)=>{
   res.statusCode=200;
   res.setHeader('Content-Type','application/json');
   res.json(promotion);
},(err)=>next(err)).catch((err)=>next(err));

});

module.exports=promoRouter;













// .get((req,res,next)=>{
//     res.end('Will Get All Promo For You !')
// })
// .post((req,res,next)=>{
//     res.end('Will Add The promo :'+req.body.name+' With Details :'+req.body.description);
// })
// .put((req,res,next)=>{
//     res.statusCode=403;
//     res.end('Operation  Put Not Supported ');
// })
// .delete((req,res,next)=>{
//     res.end('Will Delete All Promo For You !')
// });
// promoRouter.route('/:promoId')
// .get((req,res,next)=>{
//     res.end('Will Get Promo wWith '+req.params.promoId);
// })
// .post((req,res,next)=>{
//     res.end('Operation  Put Not Supported  on /Promo/'+req.params.promoId);
// })
// .put((req,res,next)=>{
//     res.end('Updating the promoe : '+req.params.promoId +'Will Update the promo ; test with details: '+req.body.description);
// })
// .delete((req,res,next)=>{
//     res.end('Deleting promo :'+req.params.promoId)
// })