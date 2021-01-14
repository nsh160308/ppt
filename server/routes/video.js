const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber")
const multer = require('multer');
const path = require('path');
var ffmpeg = require('fluent-ffmpeg');



//=================================
//             Video
//=================================

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'videos/')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4') {
            return cb(res.status(400).end('.mp4 확장자만 업로드 가능합니다.'), false)
        }
        cb(null, true)
    }
})

var upload = multer({ storage: storage }).single("Video")


router.post('/uploadfiles', (req, res) => {

    // 비디오를 서버에 저장한다.
    upload(req, res, err => {
        if(err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, url: req.file.path, fileName: req.file.filename })
    })
})

router.post('/thumbnail', (req, res) => {

    let filePath = "" //썸네일 경로 받을 변수
    let fileDuration = "" //영상 길이 받을 변수
    let filename = ""//썸네일 이름 받을 변수

    // 비디오 전체 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        //console.dir(metadata);
        //console.log(metadata.format.duration)
        fileDuration = metadata.format.duration;
        console.log(fileDuration);
    })


    // 썸네일을 생성
    ffmpeg(req.body.url)
    //filenames는 썸네일 이름을 생성
    .on('filenames', function (filenames) {
        console.log('생성할 것입니다.' + filenames.join(', '))
        console.log(filenames)

        filename = filenames;
        filePath = "videos/thumbnails/" + filenames[0]

        console.log('filePath',filePath)
    })
    //end는 썸네일을 생성한 후 하는 일
    .on('end', function () {
        console.log('캡처한 스크린샷');
        //json형식으로 썸네일 저장 경로(url), 썸네일 이름(fileName), 영상 길이(fileDuration)
        return res.json({ success: true, url: filePath, fileName: filename, fileDuration: fileDuration})
    })
    //만약에 에러가 났을 때는 여기서 에러 처리
    .on('error', function (err) {
        console.error(err);
        return res.json({ success: false, err })
    })
    //옵션을 줄 수 있다.
    .screenshot({
        count: 3, //영상 길이의 20% 40% 60%에 해당하는 스크린샷 찍기
        folder: 'videos/thumbnails', //생성된 썸네일 파일의 출력 폴더
        size: '320x240',
        filename: 'thumbnail-%b.png' //%b => 확장자를 뺀 원래이름
    })
})

//비디오 업로드
router.post('/uploadVideo', (req, res) => {

    console.log('비디오 업로드', req.body);

    //비디오 정보를 mongoDB에 저장한다.
    const newVideo = new Video(req.body);

    newVideo.save((err, videoInfo) => {
        if(err) return res.json({ success: false, err })
        res.status(200).json({ success: true, videoInfo })
    })
})

//업로드된 모든 비디오 정보 가져오기
router.get('/getVideos', (req, res) => {

    //비디오를 DB에서 가져와서 클라이언트에 보낸다.
    Video.find()
        .populate('writer')
        .exec((err, videoInfo) => {
            if(err) return res.json({ success: false, err })
            res.status(200).json({ success: true, videoInfo })
        })
})

//하나의 비디오 정보 가져오기
router.post('/getVideoDetail', (req, res) => {

    //비디오를 DB에서 가져와서 클라이언트에 보낸다.
    Video.findOne({ _id: req.body.videoId })
        .populate('writer')
        .exec((err, videoDetail) => {
            if(err) return res.json({ success:false, err })
            res.status(200).json({ success: true, videoDetail })
        })
})

//구독한 사람의 비디오 가져오기
router.post('/getSubscriptionVideos', (req, res) => {

    //자기 아이디를 가지고 구독한 사람을 찾는다.
    Subscriber.find({ userFrom: req.body.userFrom })
        .exec((err, subscriberInfo) => {
            if(err) res.status(400).json({ success: false, err })
            
            //찾은 사람들의 비디오를 가지고 온다.
            //찾은 사람은 subscriberInfo안의 userTo에 있다.
            //여러명일 수 있으니 map을 이용해서 저장한다.

            let subscribedUser = [];

            subscriberInfo.map((subscriber, index) => {
                subscribedUser.push(subscriber.userTo)
            })

            Video.find({ writer: { $in: subscribedUser }})
                .populate('writer')
                .exec((err, videos) => {
                    if(err) return res.status(400).send(err)
                    res.status(200).json({ success: true, videoInfo: videos})
                })

        })
    
    
})

module.exports = router;
