const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const {check, validationResult } = require('express-validator');

const User = require('../../models/User');

//@route  GET api/users
//@desc   Resgister user
//@access Public
router.post('/',[
    check('name','Name is Required').not().isEmpty(),
    check('email','Enter valid email').isEmail(),
    check('password','enter valid password').isLength({min:6})
],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {name,email,password} = req.body;

    try{
    //see if user exists
    let user = await User.findOne({email});
    if(user){
       return res.status(400).json({errors:[{msg:'user already exists'}]});
    }


    //get users gravatar
    const avatar = gravatar.url(email,{
        s:'200',
        r:'pg',
        d:'mm'
    })

    user = new User({
        name,
        email,
        avatar,
        password
    });

    //encrypt the password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password,salt);

    await user.save();

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