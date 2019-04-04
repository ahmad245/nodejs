const authenticate=require('../authenticate');
const {Favorite}=require('../model/favorite');
const cors = require('./cors');

const express = require('express');
const bodyParser = require('body-parser');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,authenticate.verifyUser, (req,res,next)=>{
    Favorite.find({user:req.user._id}).populate('user').populate('dish').then((favorites)=>{
        if(favorites!=null){
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(favorites);
        } else if(favorites==null){  err=new Error('favorites  not Found');
        res.status=404;
        return next(err); }
    
        
    },(err)=>next(err)).catch((err)=>next(err));
 })
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
  Favorite.findOne({user:req.user._id})
  .then((favorite)=>
  {
      if(favorite==null)
      {
                Favorite.create({
                    user:req.user._id,
                    dish:req.body})
                    .then((favorite)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorite);
                },(err)=>next(err)).catch((err)=>next(err));
      }
      else{
         //either using  favorite.dish.indexOf(req.params.dishId) and add 
         //or 
          Favorite.findByIdAndUpdate(favorite._id,
            {
             //The $addToSet operator adds a value to an array unless the value is already present, in which case $addToSet does nothing to that array.
                $addToSet:{dish:req.body}},{new:true} )
               .then((favorite)=>{
                                        res.statusCode=200;
                                        res.setHeader('Content-Type','application/json');
                                        res.json(favorite);
                }).catch((err)=>next(err))
      }
  },(err)=>next(err)).catch((err)=>next(err));
  
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
      Favorite.findOneAndRemove({user:req.user})
      .then((favorite)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(favorite);
    },(err)=>next(err)).catch((err)=>next(err));
});

/////////////////////////////:dishId///////////////////////////////////////////////////////////////

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end('Get operation not supported on /favorites');
})

.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favorite.findOne({user:req.user._id})
    .then((favorite)=>
    {
        if(favorite==null)
        {
            Favorite.create({
                user:req.user._id,
                dish:req.params.dishId})
                .then((favorite)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(favorite);
            },(err)=>next(err)).catch((err)=>next(err));
        }
        else{
            
                Favorite.findByIdAndUpdate(favorite._id,
                    {
                        //The $addToSet operator adds a value to an array unless the value is already present, in which case $addToSet does nothing to that array.
                        $addToSet:{dish:req.params.dishId}},{new:true} )
                    .then((favorite)=>{
                                                res.statusCode=200;
                                                res.setHeader('Content-Type','application/json');
                                                res.json(favorite);
                        }).catch((err)=>next(err))
        }
    },(err)=>next(err)).catch((err)=>next(err));
    
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favorite.findOne({user:req.user._id}).then((favorite)=>{
        if(favorite!=null  )
        {  
            let index=favorite.dish.indexOf(req.params.dishId);
            if(index!=-1)
            { 
                favorite.dish.splice(index,1);
                favorite.save().then((dish)=>{
                            res.statusCode=200;
                            res.setHeader('Content-Type','application/json');
                            res.json(dish);
                    
                   }, (err)=>next(err));

            }
            else{
                err=new Error('favorite '+req.params.dishId+' not Found');
            res.status=404;
            return next(err);
            }
           
            
         }
         else {  err=new Error('favorite '+req.params.dishId+' not Found');
            res.status=404;
            return next(err); }
    },(err)=>next(err))
})

module.exports=favoriteRouter;
