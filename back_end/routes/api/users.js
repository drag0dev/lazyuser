const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth'); // function meant to check verify the jwt

const User = require('../../models/User'); // user model

const bcrypt = require('bcryptjs');
const saltRounds = require('../../config/hashing').saltRounds;
const pepper = require('../../config/hashing').pepper;
const token_key = require('../../config/keys').token_key;

// @route   POST api/user/checklogin
// @desc    Check if jwt has expired
router.post('/checklogin', auth, (req, res)=>{
    User.findOne({_id: req.user.user_id}, (err, user)=>{
        if(err){
            res.status(500).send();
            return;
        }else if(!user){
            res.status(400).send();
            return;
        }
        else {
            res.status(200).json({username: user.username});
            return;
        }
    });
});

// @route   POST api/user/checklogin
// @desc    Check if jwt has expired
router.get('/logout', auth, (req, res)=>{
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    res.status(200).send();
    return;
});


// @route   POST api/user/register
// @desc    Make a new user
router.post('/register', async (req, res)=> {

    if(!req.body.username || !req.body.password || !req.body.email){
        res.status(400).json({error: 'info is missing'});
        return;
    }

    let num = await User.exists({username: req.body.username}); // count how many users exist with the provided username
    if(num!=0){ // if username is already in use
        res.status(400).json({error: 'username already in use'});
        return;
    }

    num = await User.exists({email: req.body.email});
    if(num!=0){ // if username is already in use
        res.status(400).json({error: 'email already in use'});
        return;
    }

    let newUser = new User();

    newUser.username = req.body.username; // setting the username
    newUser.email = req.body.email; // sett the email

    let salt = await bcrypt.genSalt(saltRounds); // generating salt
    newUser.password = await bcrypt.hash(req.body.password + pepper, salt); // hashing password

    newUser.save((err)=>{ // save user
        if(err){
            res.status(400).json({error: err});
            return;
        }
    });

    newUser.token = jwt.sign( // generate jwt
        {user_id: newUser._id,},
        token_key,
        {
            expiresIn: '7d',
        }
    );

    res.cookie("access_token", newUser.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    }).status(200).send();

});

// @route   POST api/user/login
// @desc    Check if user info is correct and make him a jwt
router.post('/login', async (req,res)=>{
    if(!req.body.username){
        res.status(400).json({error: 'missing username'});
        return;
    }
    if(!req.body.password){
        res.status(400).json({error: 'missing password'});
        return;
    }

    let userOld = await User.findOne({username: req.body.username}); // try to find a user using username
    if (userOld == undefined){
        res.status(400).json({error: 'wrong credintials'});
        return;
    }

    let newToken = jwt.sign(  // upon every login regenerate jwt
        {user_id: userOld._id},
        token_key,
        {
            expiresIn: '7h',
        }
    );
    res.cookie("access_token", newToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    
    let validPassword = await bcrypt.compare(req.body.password+pepper, userOld.password); // checking if the password is correct
    if(validPassword){
        User.findOneAndUpdate({username: req.body.username}, {token: newToken}, (err, user)=>{ // updating the db with new token
            if(err){
                res.status(500).json({error: err});
                return;
            }
        });
        res.status(200).send();
        return;
    }
    else{
        res.status(400).json({error: 'wrong credintials'});
        return;
    }
});

// @route   DELETE api/user/del
// @desc    Delete a user
router.delete('/del', auth, (req, res)=>{
    if(!req.body.username){
        res.status(400).json({error: 'missing username'});
        return;
    }
    else{

        User.findOne({username: req.body.username}, (err, user)=>{
            if(user._id != req.user.user_id){ // if id of the username and id from the jwt are not the same
                res.status(403).json({error: 'invalid request'});
                return;
            }
            else if(user.username != req.body.username){ // if provided username and username based on id from jwt are not the same
                res.status(403).json({error: 'invalid request'});
                return;
            }
            else{
                User.findOneAndRemove({_id: req.user.user_id}, (err)=>{
                    if(err){
                        res.status(500).json({error: err});
                        return;
                    }
                    else{
                        res.status(200).send();
                        return;
                    }
                });
            }
        });
    }
});

// @route   POST api/user/addgame
// @desc    Add a game
router.post('/addgame', auth, (req, res)=>{
    if(!req.body.username){
        res.status(400).json({error: 'missing username'});
        return;
    }
    if(!req.body.gameName){
        res.status(400).json({error: 'missing name of the game'});
        return;
    }

    User.findOne({username: req.body.username}, (err, user)=>{
        if(err){
            res.status(500).json({error: err});
            return;
        }
        else if(!user){
            res.status(404).json({error: 'user not found'});
            return 
        }
        else if(user._id != req.user.user_id){ // if id of the username and id from the jwt are not the same
            res.status(403).json({error: 'bad request'});
            return;
        }
        else if(user.username != req.body.username){ // if provided username and username based on id from jwt are not the same
            res.status(403).json({error: 'bad request'});
            return;
        }
        else{
            User.findOneAndUpdate({username: req.body.username}, {$addToSet: {games: req.body.gameName.toUpperCase()}}, {upsert: false},
                (err)=>{
                    if(err){
                        res.status(500).json({error: err});
                        return;
                    }
                    else{
                        res.status(200).send();
                    }
                }
            );
        }
    });
});

// @route   DELETE api/user/delgame
// @desc    Remove a games from a user
router.post('/delgame', auth, (req, res)=>{
    if(!req.body.username){
        res.status(400).json({error: 'missing username'});
        return;
    }
    else if(!req.body.gameName){
        res.status(400).json({error: 'missing name of the game'});
        return;
    }
    
    User.findOne({username: req.body.username}, (err, user)=>{
        if(err){
            res.status(500).json({error: err});
            return;
        }
        else if(!user){
            res.status(404).json({error: 'user not found'});
            return;
        }
        else if(user._id != req.user.user_id){ // if id of the username and id from the jwt are not the same
            res.status(403).json({error: 'invalid request'});
            return;
        }
        else if(user.username != req.body.username){ // if provided username and username based on id from jwt are not the same
            res.status(403).json({error: 'invalid request'});
            return;
        }
        else{
            User.findOneAndUpdate({username: req.body.username}, {$pull: {games: req.body.gameName.toUpperCase()}},
                (err)=>{
                if(err){
                    res.status(500).json({error: err});
                    return;
                }
                else{
                    res.status(200).send();
                    return;
                }
            });
        }
    });
});

// @route   POST api/user/games
// @desc    Retrieve all games for a user
router.post('/games', auth, (req, res)=>{
    if(!req.body.username){
        res.status(400).json({error: 'missing username'});
        return;
    }

    User.findOne({username: req.body.username}, (err, user)=>{
        if(err){
            res.status(500).send();
            return;
        }
        else if(!user){
            res.status(400).send();
            return;
        }
        else{
            if(user._id != req.user.user_id){
                res.status(400).send();
                return;
            }else{
                res.status(200).json(user.games);
                return;
            }
        }
    });
});

module.exports = router;