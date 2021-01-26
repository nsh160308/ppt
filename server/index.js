const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors')
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const mongoose = require("mongoose");
//Express.js는 쿠키 처리 방법을 몰라서
//cookie-session라이브러리 설치
const cookieSession = require('cookie-session');
//Passport를 이용한 소셜 로그인
const passport = require('passport');
const morgan = require('morgan');
const helmet = require('helmet');
var flash = require('connect-flash');
const url = require('url');
require("./config/passport");
//몽고DB 연동
mongoose.connect(config.mongoURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log('몽고 DB 연결완료...'))
  .catch(err => console.error(err))

//앱에 쿠키를 사용하도록 지시
app.use(
  cookieSession({
    maxAge: 1209600000,  // 2 주 (밀리 초)
    keys: [config.cookieEncryptionKey]//
  })
);


//인증을 처리하기 위해 쿠키를 사용하도록 passport에게 지시
app.use(passport.initialize());
app.use(passport.session());

//CORS 정책 미들웨어
app.use(cors())

//지원 중단 경고 또는 오류를 받지 않으려면
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//json형식 데이터를 얻으려면
//application/json유형 데이터를 파싱
app.use(bodyParser.json());

app.use(cookieParser());

app.use(helmet())

//미들웨어 로그
app.use(morgan('dev'));

//flash메세지
app.use(flash());

app.get('/error', (req, res) => {
  res.redirect(url.format({
    pathname:'http://localhost:3000/login',
    query: {
      'msg':'error'
    }
  }));
});

//유저관련 미들웨어
app.use('/api/users', require('./routes/users'));

//구글 로그인
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/error'}), (req, res) => {
    //success
    res.redirect('http://localhost:3000/');
  }
)

//페이스북 로그인
app.get('/auth/facebook', passport.authenticate('facebook', {
  authType: 'reauthenticate', //거부된 권한을 재요청
  scope: ['public_profile', 'email']
}));

app.get('/auth/facebook/callback', passport.authenticate('facebook'), (req, res) => {
  console.log('페이스북 콜백');
  res.redirect("http://localhost:3000/");
})

//카카오 로그인
app.get('/auth/kakao', passport.authenticate('kakao', {authType: 'reauthenticate',}));

app.get('/auth/kakao/callback', passport.authenticate('kakao'), (req, res) => {
  res.redirect("http://localhost:3000/");
})

//네이버 로그인
app.get('/auth/naver', passport.authenticate('naver'))

app.get('/auth/naver/callback', passport.authenticate('naver'), (req, res) => {
  res.redirect("http://localhost:3000/");
})

//쇼핑몰 - 상품에 대한 미들웨어
app.use('/api/product', require('./routes/product'));
//쇼핑몰 - 상품리뷰에 대한 미들웨어
app.use('/api/productComment', require('./routes/productComment'));
//쇼핑몰 - 상품,댓글 좋아요 관련 미들웨어
app.use('/api/productLD', require('./routes/productLD'));
//유튜브 - 영상에 대한 미들웨어
app.use('/api/video', require('./routes/video'));
//유튜브 - 구독 관련 미들웨어
app.use('/api/subscribe', require('./routes/subscribe'));
//유튜브 - 댓글 관련 미들웨어
app.use('/api/videoComment', require('./routes/videoComment'));
//유튜브 - 영상,댓글 좋아요 관련 미들웨어
app.use('/api/videoLD', require('./routes/videoLD'));
//이것을 사용하여 노드 js 서버에있는 이미지를 클라이언트에 표시(react js).
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use('/uploads', express.static('uploads'));
app.use('/videos', express.static('videos'));
// 배포버전인 경우
if (process.env.NODE_ENV === "production") {
  // 정적 폴더 설정
  // 모든 javascript 및 css 파일을이 폴더에서 읽고 제공
  app.use(express.static("client/build"));
  // 모든 페이지 경로 html 또는 라우팅 및 탐색에 대한 index.html
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});