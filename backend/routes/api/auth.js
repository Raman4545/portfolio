const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const config = require('config');
const {check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


//@route  GET api/auth
//@desc   TEST route
//@access Public
router.get('/',auth,async (req,res)=>{
    try{
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);

    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');

    }
});

//@route  GET api/auth
//@desc   Authenticate user and get token
//@access Public
router.post('/',[
    
    check('email','Enter valid email').isEmail(),
    check('password','password is required').exists()
],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {email,password} = req.body;

    try{
    //see if user exists
    let user = await User.findOne({email});
    if(!user){
       return res.status(400).json({errors:[{msg:'Invalid credentials'}]});
    }


    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({errors:[{msg:'Invalid credentials'}]});
    }
   

    //return jwt webtoken
    const payload={
        user:{
            id:user.id
        }
    }

    jwt.sign(
        payload,
        config.get('jwtToken'),
        {expiresIn:36000},
        (err,token)=>{
            if (err) throw err;
            res.json({token});


        })





    

    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');

    }
    






   
}
    );


module.exports = router;