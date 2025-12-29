var express = require('express');
var router = express.Router();
const axios = require('axios')
const Account = require('../models/account')

router.get('/auth/google', (req, res) => {
   try{
   const CLIENT_ID = process.env.CLIENT_ID
   const REDIRECT_URI = 'http://localhost:3000/auth/google/callback';
   if(CLIENT_ID && REDIRECT_URI){
     const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
     res.redirect(url);
   }else{
    res.redirect('/login');
   }
   }catch(err){
    res.send(err)
   }
});

// Callback URL for handling the Google Login response
router.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const CLIENT_ID = process.env.CLIENT_ID
    const REDIRECT_URI = 'http://localhost:3000/auth/google/callback';
    const CLIENT_SECRET = process.env.CLIENT_SECRET
  
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token, id_token } = data;

    // Use access_token or id_token to fetch user profile
    const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { email, name, picture, id } = profile;

    let user = await Account.findOne({ email });
    if(!user){
        user = await Account.create({
            googleId: id,
            email,
            name
        });
    }

     req.session.user = {
      id: user._id,
      email: user.email,
      name: user.name,
    };
    res.redirect('/payment');
  } catch (error) {
    console.error('Error:', error.response.data.error);
    res.redirect('/login');
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Logout failed');
    res.clearCookie('sid');
    res.redirect('/login');
  });
});

router.get('/login', (req, res) => {
   try{
     res.render('loginpage', {
            title: "login page"
        })
   }catch(err){
    res.send(err)
   }
});

module.exports = router;
