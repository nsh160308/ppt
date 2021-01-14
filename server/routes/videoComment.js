const express = require('express');
const router = express.Router();
const { VideoComment } = require("../models/VideoComment");


//=================================
//           비디오 댓글
//=================================

router.post('/saveComment', (req, res) => {
    console.log(req.body);

    const comment = new VideoComment(req.body)

    comment.save((err, comment) => {
        if(err) return res.status(400).json({ success: false, err })

        VideoComment.find({ _id: comment._id })
            .populate('writer')
            .exec((err, result) => {
                if(err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success:true, comment: result })
            })
    })
})

//모든 댓글 정보 가져오기
router.post('/getComments', (req, res) => {
    console.log(req.body);

    VideoComment.find({ videoId: req.body.videoId })
        .populate('writer')
        .exec((err, comments) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, comments: comments }) 
        })

})




module.exports = router;
