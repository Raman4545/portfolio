const jwt = require('jsonwebtoken');
const config = require('config');

module.exports  = function(req,res,next){
    //get token from the header
    const token = req.header('x-auth-token');

    //check if no token
    if(!token){
            return res.status(401).json({msg:'no token,authorization denied'});

    }

    //verify token
    try{
     const decoded = jwt.verify(token,config.get('jwtToken'));

     req.user = decoded.user;
     next();
    }catch(err){
        req.status(401).json({msg:"token not valid"});

    }

}

