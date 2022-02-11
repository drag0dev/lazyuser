const jwt = require('jsonwebtoken');
const token_key = require('../config/keys').token_key;

function verifyToken(req, res, next){
    //token can be sent in a cookie
    const token = req.cookies.access_token;
    if(!token){
        res.status(401).json({err: 'token required for authentication'});
        return;
    }

    jwt.verify(token, token_key, (err, decoded)=>{
        if(err){
                res.status(500).json({error: err});
                return;
        }
        if(!decoded){
            res.status(400).json({error: 'invalid token auth'});
            return;
        }
        if(decoded){
            req.user = decoded;
            return next();
        }
    });
}

module.exports = verifyToken;
