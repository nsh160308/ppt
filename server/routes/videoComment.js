const { allLimit } = require('async');
const express = require('express');
const router = express.Router();
const { VideoComment } = require("../models/VideoComment");

//=================================
//           비디오 댓글
//=================================

router.post('/saveComment', (req, res) => {
    console.log(req.body);

    if(req.body.newDate) {
        const comment = new VideoComment(req.body)

        comment.save((err, comment) => {
            if(err) return res.status(400).json({ success: false, err })
    
            VideoComment.find({ _id: comment._id })
                .populate('writer')
                .exec((err, result) => {
                    if(err) return res.status(400).json({ success: false, err })
                    res.status(200).json({ success:true, comment: result, newDate: true })
                })
        })
    } else {
        const comment = new VideoComment(req.body)

        comment.save((err, comment) => {
            if(err) return res.status(400).json({ success: false, err })
    
            VideoComment.find({ _id: comment._id })
                .populate('writer')
                .exec((err, result) => {
                    if(err) return res.status(400).json({ success: false, err })
                    res.status(200).json({ success:true, comment: result, newDate: false })
                })
        })

    }
})

//모든 댓글 정보 가져오기
router.post('/getComments', (req, res) => {
    console.log('받아온 정보',req.body);

    let limit = req.body.limit ? parseInt(req.body.limit) : allLimit;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    if(req.body.normal) {
        VideoComment.find({ videoId: req.body.videoId })
            .populate('writer')
            .skip(skip)
            .limit(limit)
            .exec((err, comments) => {
                if(err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, comments, postSize: comments.length, status: 'normal' })
            })
    } else {
        VideoComment.find({ videoId: req.body.videoId })
            .populate("writer")
            .sort([['updatedAt', 'desc']])
            .skip(skip)
            .limit(limit)
            .exec((err, comments) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, comments, postSize: comments.length, status: 'newDate' })
            })
    }
})

//선택한 댓글 삭제
router.post('/deleteComment', (req, res) => {
    console.log('is true data?', req.body);

    VideoComment.findOneAndDelete({ _id: req.body._id })
        .exec((err, result) => {
            if(err) res.status(400).json({ success: false, err })

            VideoComment.find()
                .populate('writer')
                .exec((err, comments) => {
                    if(err) res.status(400).json({ success: false, err })
                    res.status(200).json({ success: true, comments, status: 'delete' })
                })
        })
})

//선택한 댓글 수정
router.post('/modifyComment', (req, res) => {
    console.log('is true data?', req.body);

    VideoComment.findOneAndUpdate(
        { _id: req.body._id},
        { $set: { content: req.body.content, modify: req.body.modify }},
        {new : true},
        (err, comment) => {
            if(err) res.status(400).json({ success: false, err })
        })
        .populate('writer').exec((err, comment) => {
            if(err) res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, comment, status: 'modify' })
        })
        
})





module.exports = router;
