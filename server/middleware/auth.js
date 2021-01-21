let auth = (req, res, next) => {
  console.log('axios.get', req.user);
  if (req.isAuthenticated()) {
    return next();
  } else {
    console.log('isAuthenticated() false')
    return res.json({
      isAuth: false,
      error: true
    });
  }
};

module.exports = { auth };
