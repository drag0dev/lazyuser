const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth'); // function meant to check verify the jwt
const nodemailer = require('nodemailer');
const uuidv1 = require('uuidv1');

const email = require('../../config/email_credentials');
const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    secureConnetion: false,
    port: 587,
    tls: {
        ciphers: 'SSLv3'
    },
    auth: {
        user: email.username,
        pass: email.pw
    },
    path: '' 
});

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
            res.status(200).json({username: user.username, email: user.email, emailStatus: user.emailVerified});
            return;
        }
    }).clone();
});

// @route   GET api/user/checklogin
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
    newUser.emailVerified= false;

    let salt = await bcrypt.genSalt(saltRounds); // generating salt
    newUser.password = await bcrypt.hash(req.body.password + pepper, salt); // hashing password

    await newUser.save((err)=>{ // save user
        if(err){
            console.log(err)
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

    let validPassword = await bcrypt.compare(req.body.password+pepper, userOld.password); // checking if the password is correct
    if(validPassword){
        await User.findOneAndUpdate({username: req.body.username}, {token: newToken}, (err, user)=>{ // updating the db with new token
            if(err){
                res.status(500).json({error: err});
                return;
            }
        }).clone();

        res.cookie("access_token", newToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        }); 

        res.status(200).send({username: userOld.username, email: userOld.email, emailStatus: userOld.emailVerified});
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
                }).clone();
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
            ).clone();
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
            }).clone();
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


// @route   POST api/user/changeinfo
// @desc    Retrieve all games for a user
router.post('/changeinfo', auth, async (req, res)=>{
    let newEmail, newPassword;

    if(!req.body.password){
        res.status(400).json({error: 'missing current password'});
        return;
    }
    
    if(req.body.newEmail){
        newEmail = req.body.newEmail
    }
    else if(req.body.newPassword){
        newPassword = req.body.newPassword;
    }
    else{
        res.status(400).json({erorr: 'information to be changed need to me provided'});
    }

    const oldUser = await User.findOne({_id: req.user.user_id}, (err, user)=>{
        if(err){
            res.status(401).send();
            return;
        }
        else if(!user){
            res.status(400).json({error: 'user not found'}).send();
            return;
        }
    }).clone();

    let validPassword = await bcrypt.compare(req.body.password+pepper, oldUser.password);

    if(!validPassword){
        res.status(400).json({error: 'incorrect credentials'}).send();
        return;
    }

    if (newEmail){
        User.findOneAndUpdate({_id: req.user.user_id}, {email: newEmail, emailVerified: false}, (err, user) => {
            if(err){
                res.status(401).send();
                return;
            }
            else if(!user){
                res.status(400).json().send();
                return
            }
            else{
                return;
            }
        });
    }
    else{
        let salt = await bcrypt.genSalt(saltRounds);
        let hashedPassword = await bcrypt.hash(newPassword + pepper, salt);
        User.findOneAndUpdate({_id: req.user.user_id}, {password: hashedPassword}, (err, user) => {
            if(err){
                res.status(401).send();
                return;
            }
            else if(!user){
                res.status(400).json().send();
                return;
            }
            else{
                res.status(200).send();
                return;
            }
        });

    }

});

// @route   POST api/user/forgot
// @desc    Reset password for a given user
router.post('/forgot', async (req, res)=>{
    let givenString;
    if (!req.body.username){
        res.status(400).json({error: 'missing username/email'}).send();
        return;
    }
    givenString = req.body.username;

    let oldUser;
    if(givenString.includes('@')){ // find user by email
        oldUser = await User.findOne({email: givenString});
        if(oldUser==undefined){
            res.status(200).send();
            return;
        }
    }else{ // find user by username
        oldUser = await User.findOne({username: givenString});
        if(oldUser == undefined){
            res.status(200).send();
            return;
        }
    }

    let newPw = uuidv1();
    let salt = await bcrypt.genSalt(saltRounds); // generating salt
    oldUser.password = await bcrypt.hash(newPw + pepper, salt); // hashing password

    await oldUser.save().catch(err => {
        res.status(401).send();
        return;
    });


    let options = {
        from: email.username,
        to: oldUser.email,
        subject: 'LazyUser - Password reset',
        text: `Hi ${oldUser.username},\n\nYour new passowrd is: ${newPw}\n\nThank you, LazyUser`
    }

    await transporter.sendMail(options, (err, info)=>{
        if(err){
            console.log(`Error: ${err}`);
            res.status(401).send();
            return;
        }
        else{
            res.status(200).send();
        }
    });
});

// @route   POST api/user/verifyemail
// @desc    Verify given email
router.post('/verifyemail', (req, res) => {
    if(!req.body.vid){
        res.status(400).json({error: 'missing vid'}).send();
        return;
    }
    let vid = req.body.vid;

    User.findOneAndUpdate({emailVerificationToken: vid}, {emailVerified: true}, {returnNewDocument: true},(err, user)=>{
        if(err){
            res.status(500).send();
            return;
        }
        else if(!user){
            res.status(400).json({error: 'user not found'}).send();
            return;
        }
        else{
            if(!user.emailVerified){
                res.status(200).send();
                return;
            }else{
                res.status(400).send();
                return;
            }
        }
    });
});

// @route  POST api/user/requestev
// @desc   Send a verification email
router.post('/requestev', auth, async (req, res)=>{
    let oldUser = await User.findOne({_id: req.user.user_id});
    if(oldUser==undefined){
        res.status(400).send();
        return;
    }

    let token = uuidv1();

    oldUser.emailVerificationToken = token;
    await oldUser.save().catch((err) => {
        res.status(500).send();
        return;
    });

    let resetLink = `http://localhost:3000/verifyem/${token}`;

    let options = {
        from: email.username,
        to: oldUser.email,
        subject: 'LazyUser - Verify your email',
        text: `Hi ${oldUser.username},\n\nClick this to verify your email -> ${resetLink}\n\nThank you, LazyUser`
    }

    await transporter.sendMail(options, (err, info)=>{
        if(err){
            console.log(`Error: ${err}`);
            res.status(401).send();
            return;
        }
        else{
            res.status(200).send();
        }
    });

});
module.exports = router;