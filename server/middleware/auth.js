let auth = (req, res, next) => {
  console.log('user_actions가 준 정보', req.user);
  if (req.isAuthenticated()) {
    return next();
  } else {
    console.log('isAuthenticated() is false');
    return res.json({
      isAuth: false,
      error: true,
    })
  }
};

module.exports = { auth };
