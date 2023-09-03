const express = require('express');
const router = express.Router();
const {check, validationResult } = require('express-validator');

//@route  GET api/users
//@desc   Resgister user
//@access Public
router.post('/',[
    check('name','Name is Required').not().isEmpty(),
    check('email','Enter valid email').isEmail(),
    check('password','enter valid password').isLength({min:6})
],(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    res.send('user route')
}
    );

module.exports = router;