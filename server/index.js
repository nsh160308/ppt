const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors')

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

// const mongoose = require("mongoose");
// mongoose
//   .connect(config.mongoURI, { useNewUrlParser: true })
//   .then(() => console.log("DB connected"))
//   .catch(err => console.error(err));

const mongoose = require("mongoose");
const connect = mongoose.connect(config.mongoURI,
  {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.use(cors())

//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/users', require('./routes/users'));
app.use('/api/oAuth', require('./routes/social'));

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


//이것을 사용하여 노드 js 서버에있는 이미지를 클라이언트에 표시합니다 (react js).
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use('/uploads', express.static('uploads'));
app.use('/videos', express.static('videos'));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {

  // Set static folder   
  // All the javascript and css files will be read and served from this folder
  app.use(express.static("client/build"));

  // index.html for all page routes    html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});