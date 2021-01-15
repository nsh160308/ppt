const express = require('express');
const router = express.Router();
const { Like } = require("../models/Like");
const { Dislike } = require('../models/Dislike');


//=================================
//           좋아요 싫어요
//=================================

router.post('/getLikes', (req, res) => {
    let variable = {}

    //여기서도 영상의 좋아요를 가져오는지
    //댓글의 좋아요를 가져오는지 구분해야됩니다.
    if(req.body.videoId) {
        variable = {videoId: req.body.videoId}
    } else {
        variable = {videoCommentId: req.body.videoCommentId}
    }

    Like.find(variable)
        .exec((err, likes) => {
            if(err) return res.status(400).json({ success: false, err })

            res.status(200).json({ success:true, likes })
        })
})

router.post('/getDislikes', (req, res) => {
    let variable = {}

    //여기서도 영상의 싫어요 가져오는지
    //댓글의 싫어요 가져오는지 구분해야됩니다.
    if(req.body.videoId) {
        variable = {videoId: req.body.videoId}
    } else {
        variable = {videoCommentId: req.body.videoCommentId}
    }

    Dislike.find(variable)
        .exec((err, dislikes) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, dislikes })
        })
})

//좋아요 올리기
router.post('/upLike', (req, res) => {

    let variable = {}

    if(req.body.videoId) {
        variable = {
            userId: req.body.userId,
            videoId: req.body.videoId
        }
    } else {
        variable = {
            userId: req.body.userId,
            videoCommentId: req.body.videoCommentId
        }
    }

    // 클릭한 정보를 Like 콜렉션에 저장
    const newLike = new Like(variable);

    newLike.save((err, likeResult) => {
        if(err) return res.status(400).json({ success: false, err })

        // 만약에 Dislike이 이미 클릭 되어있다면, Dislike을 1 감소시킵니다.
        Dislike.findOneAndDelete(variable)
            .exec((err, disLikeResult) => {
                if(err) res.status(400).json({ success: false, err })
                res.status(200).json({ success:true })
            })
    })
})


//좋아요 내리기
router.post('/downLike', (req, res) => {

    let variable = {}

    if(req.body.videoId) {
        variable = {
            userId: req.body.userId,
            videoId: req.body.videoId
        }
    } else {
        variable = {
            userId: req.body.userId,
            videoCommentId: req.body.videoCommentId
        }
    }

    Like.findOneAndDelete(variable)
        .exec((err, likeResult) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success:true })
            
        })
})

//싫어요 내리기
router.post('/downDislike', (req, res) => {

    let variable = {}

    if(req.body.videoId) {
        variable = {
            userId: req.body.userId,
            videoId: req.body.videoId
        }
    } else {
        variable = {
            userId: req.body.userId,
            videoCommentId: req.body.videoCommentId
        }
    }

    Dislike.findOneAndDelete(variable)
        .exec((err, dislikeResult) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success:true })
            
        })
})

//싫어요 올리기
router.post('/upDislike', (req, res) => {

    let variable = {}

    if(req.body.videoId) {
        variable = {
            userId: req.body.userId,
            videoId: req.body.videoId
        }
    } else {
        variable = {
            userId: req.body.userId,
            videoCommentId: req.body.videoCommentId
        }
    }

    // 클릭한 정보를 DisLike 콜렉션에 저장
    const newDislike = new Dislike(variable);

    newDislike.save((err, dislikeResult) => {
        if(err) return res.status(400).json({ success: false, err })

        // 만약에 좋아요가 이미 클릭 되어있다면, 좋아요를 1 감소시킵니다.
        Like.findOneAndDelete(variable)
            .exec((err, LikeResult) => {
                if(err) res.status(400).json({ success: false, err })
                res.status(200).json({ success: true })
            })
    })
})

module.exports = router;
