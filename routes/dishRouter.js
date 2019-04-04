const {Dish,Comment}=require('../model/dish');
const authenticate=require('../authenticate');
const cors = require('./cors');

const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
     Dish.find({}).populate('comments.author').then((dishes)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
        
    },(err)=>next(err)).catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Dish.create(req.body).then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=>next(err)).catch((err)=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.veryFyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.veryFyAdmin,(req, res, next) => {
    Dish.remove({}).then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err)).catch((err)=>next(err));
});
/////////////////////DishId//////////////////////////////////////
dishRouter.route('/:dishId')
.get(cors.cors,(req,res,next) => {
    Dish.findById(req.params.dishId).populate('comments.author').
    then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=>next(err)).catch((err)=>next(err));
})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.veryFyAdmin,(req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.veryFyAdmin,(req, res, next) => {
  Dish.findByIdAndUpdate(req.params.dishId,{
      $set:req.body
  },{new:true})
  .then((dish)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(dish);
},(err)=>next(err)).catch((err)=>next(err));
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.veryFyAdmin,(req, res, next) => {
  Dish.findByIdAndRemove(req.params.dishId).
  then((dish)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(dish);
},(err)=>next(err)).catch((err)=>next(err));

});
/////////////////////Comments////////////////////////////////////////////////////////////////
dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
     Dish.findById(req.params.dishId).populate('comments.author').then((dish)=>{
         if(dish!=null)
         { res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments);}
         else{  err=new Error('Dish '+req.params.dishId+' not Found');
             res.status=404;
             return next(err); }
       
    },(err)=>next(err)).catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.veryFyAdmin,(req, res, next) => {
    Dish.findById(req.params.dishId).then((dish)=>{
        if(dish!=null)
        {  let r=dish.comments.find(a=>a.author==req.user._id);
            console.log(r);
           
                    req.body.author=req.user._id;
                    dish.comments.push(req.body);
                    dish.save().then((dish)=>{
                                Dish.findById(dish._id).populate('comments.author').then((dish)=>{
                                    res.statusCode=200;
                                    res.setHeader('Content-Type','application/json');
                                    res.json(dish);
                                }).catch((err)=>next(err))
                            
                                }, (err)=>next(err)).catch((err)=>next(err));
                                                                                   
          
         }
        else{ err=new Error('Dish '+req.params.dishId+' not Found');
            res.status=404;
            return next(err); }
   },(err)=>next(err)).catch((err)=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.veryFyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/'+req.params.dishId+'/comments');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.veryFyAdmin,(req, res, next) => {
    Dish.findById(req.params.dishId).then((dish)=>{
        if(dish!=null)
        {  
             dish.comments.length=0;
            dish.save().then((dish)=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(dish);
           }, (err)=>next(err));
         }
        else{ err=new Error('Dish '+req.params.dishId+' not Found');
            res.status=404;
            return next(err); }
   },(err)=>next(err)).catch((err)=>next(err));
});
/////////////////////CommentId//////////////////////////////////////
dishRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req, res, next) => {
    Dish.findById(req.params.dishId).populate('comments.author').
    then((dish)=>{
        if(dish!=null && dish.comments.id(req.params.commentId))
        { res.statusCode=200;
           res.setHeader('Content-Type','application/json');
           res.json(dish.comments.id(req.params.commentId));}
        else if(dish==null){  err=new Error('Dish '+req.params.dishId+' not Found');
            res.status=404;
            return next(err); }
        else{
            err=new Error('Comment '+req.params.commentId+' not Found');
            res.status=404;
            return next(err);
        }    
    },(err)=>next(err)).catch((err)=>next(err));
})

.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId+'/comments/'+req.params.commentId);
})

.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Dish.findById(req.params.dishId).
    then((dish)=>{
        if(dish!=null && dish.comments.id(req.params.commentId))
        { 
          
          if(dish.comments.id(req.params.commentId).author===req.user._id)
          {
                    if(req.body.rating)
                    {
                        dish.comments.id(req.params.commentId).rating=req.body.rating;
                    }
                    if(req.body.comment){
                        dish.comments.id(req.params.commentId).comment=req.body.comment;
                    }
                    
                    dish.save().then((dish)=>{
                        Dish.findById(dish._id).populate('comments.author').then((dish)=>{
                            res.statusCode=200;
                            res.setHeader('Content-Type','application/json');
                            res.json(dish);
                        })
                    
                }, (err)=>next(err));
          }else{
            err=new Error('Unauthorized');
            res.status=401;
            return next(err);
          }
            
        }
        else if(dish==null){  err=new Error('Dish '+req.params.dishId+' not Found');
            res.status=404;
            return next(err); }
        else{
            err=new Error('Comment '+req.params.commentId+' not Found');
            res.status=404;
            return next(err);
        }    
    },(err)=>next(err)).catch((err)=>next(err));
})

.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Dish.findById(req.params.dishId).then((dish)=>{
        if(dish!=null && dish.comments.id(req.params.commentId))
        {  
            if(dish.comments.id(req.params.commentId).author===req.user._id)
            {
                dish.comments.id(req.params.commentId).remove();
                dish.save().then((dish)=>{
                    Dish.findById(dish._id).populate('comments.author').then((dish)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(dish);
                    })
               }, (err)=>next(err));
            }
            else{
                err=new Error('Unauthorized');
                res.status=401;
                return next(err);
              }
            
         }
         else if(dish==null){  err=new Error('Dish '+req.params.dishId+' not Found');
            res.status=404;
            return next(err); }
        else{
            err=new Error('Comment '+req.params.commentId+' not Found');
            res.status=404;
            return next(err);
        }    
    },(err)=>next(err)).catch((err)=>next(err));
});

module.exports = dishRouter;