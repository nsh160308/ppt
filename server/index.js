const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/key');
const passport = require('passport');
//Express는 쿠키를 처리하는 방법을 모르기 때문에,
//그래서 'cookie-session'이라는 라이브러리를 설치했습니다.
const cookieSession = require('cookie-session');

/**
 * Passport 구성.
 */
require('./config/passport');

const app = express();

mongoose.connect(config.mongoURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error(err));

// 앱에 쿠키를 사용하도록 지시
app.use(
  cookieSession({
    maxAge: 1209600000,  // 2 주 (밀리 초)
    keys: [config.cookieEncryptionKey]//
  })
);

// 인증을 처리하기 위해 쿠키를 사용하도록 pasport에 지시
app.use(passport.initialize());
app.use(passport.session());

//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

// Helmet helps you secure your Express apps by setting various HTTP headers. 
app.use(helmet())

// Logger Middleware
app.use(morgan('dev'));

// CORS Middleware
app.use(cors());

app.use('/api/users', require('./routes/users'));

//구글 로그인
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect("http://localhost:3000/");
});

//페이스북 로그인
app.get('/auth/facebook', passport.authenticate('facebook', {
  authType: 'reauthenticate', //거부된 권한을 재요청
  scope: ['email']
}));

app.get('/auth/facebook/callback', passport.authenticate('facebook'), (req, res) => {
  res.redirect("http://localhost:3000/");
})

//카카오 로그인
app.get('/auth/kakao', passport.authenticate('kakao', {authType: 'reauthenticate',}));

app.get('/auth/kakao/callback', passport.authenticate('kakao'), (req, res) => {
  res.redirect("http://localhost:3000/");
})


//use this to show static files you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use('/uploads', express.static('uploads'));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {

  // Set static folder
  // All the javascript and css files will be read and served from this folder
  app.use(express.static("client/build"));

  // index.html for all page routes  html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server Running at ${port}`)
});