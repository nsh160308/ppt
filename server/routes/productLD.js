const express = require('express');
const router = express.Router();
const { Like } = require("../models/Like");
const { Dislike } = require('../models/Dislike');


//=================================
//           좋아요 싫어요
//=================================

router.post('/getLikes', (req, res) => {
    //console.log('제대로 넘어오니?', req.body)
    //console.log('잘 넘어왔는가', req.body);

    /**
     * 클라이언트에서 보낸 데이터에 productId가 있으면,
     * 상품정보 좋아요를 찾아서 보내주고 없다면,
     * 상품댓글 좋아요를 찾아서 보내줍니다.
     */
    let variable = {};

    if(req.body.productId) {
        variable = { productId: req.body.productId }
    } else {
        variable = { productCommentId: req.body.productCommentId }
    }

    Like.find(variable)
        .exec((err, likes) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, likes })
        })
})

router.post('/getDisLikes', (req, res) => {
    //console.log('disLike정보가 넘어오니?', req.body)

    /**
     * 클라이언트에서 보낸 데이터에 productId가 있으면,
     * 상품정보 싫어요를 찾아서 보내주고 없다면,
     * 상품댓글 싫어요를 찾아서 보내줍니다.
     */
    let variable = {};

    if(req.body.productId) {
        variable = { productId: req.body.productId }
    } else {
        variable = { productCommentId: req.body.productCommentId }
    }

    Dislike.find(variable)
        .exec((err, disLikes) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, disLikes })
        })
})

//좋아요 클릭
router.post('/upLike', (req, res) => {
    
    console.log('1', req.body)

    let variable = {};

    if(req.body.productId) {
        variable = { 
            userId: req.body.userId,
            productId: req.body.productId 
        }
    } else {
        variable = { 
            userId: req.body.userId,
            productCommentId: req.body.productCommentId 
        }
    }

    console.log('2', variable)

    //좋아요 클릭 정보 저장
    const newLikeInfo = new Like(req.body);

    console.log('3', newLikeInfo)

    newLikeInfo.save((err, result) => {
        if(err) return res.status(400).json({ success: false, saveError: err })
        
        //만약에 싫어요 누른 상태에서 좋아요 클릭했다면 싫어요 정보 삭제
        Dislike.findOneAndDelete(variable)
            .exec((err, result) => {
                if(err) return res.status(400).json({ success: false, deleteError: err })
                res.status(200).json({ success:true, deleteError: false })
            })
    })
})

//좋아요 취소
router.post('/downLike', (req, res) => {
    
    let variable = {};

    if(req.body.productId) {
        variable = { 
            userId: req.body.userId,
            productId: req.body.productId 
        }
    } else {
        variable = { 
            userId: req.body.userId,
            productCommentId: req.body.productCommentId 
        }
    }

    Like.findOneAndDelete(variable)
        .exec((err, result) => {
            if(err) return res.json({ success: false, deleteError: err })
            res.status(200).json({ success: true, deleteError: false })
        })
    
})

//싫어요 클릭
router.post('/upDislike', (req, res) => {
    
    let variable = {};

    if(req.body.productId) {
        variable = { 
            userId: req.body.userId,
            productId: req.body.productId 
        }
    } else {
        variable = { 
            userId: req.body.userId,
            productCommentId: req.body.productCommentId 
        }
    }

    //싫어요 클릭 정보 저장
    const newDislikeInfo = new Dislike(req.body);

    newDislikeInfo.save((err, disLikes) => {
        if(err) return res.status(400).json({ success: false, saveError: err })
        
        //만약에 좋아요 누른 상태에서 싫어요 클릭했다면 좋아요 정보 삭제
        Like.findOneAndDelete(variable)
            .exec((err, result) => {
                if(err) return res.status(400).json({ success: false, deleteError: err })
                res.status(200).json({ success:true, deleteError: false })
            })
    })
})

//싫어요 취소
router.post('/downDislike', (req, res) => {
    
    let variable = {};

    if(req.body.productId) {
        variable = { 
            userId: req.body.userId,
            productId: req.body.productId 
        }
    } else {
        variable = { 
            userId: req.body.userId,
            productCommentId: req.body.productCommentId 
        }
    }

    Dislike.findOneAndDelete(variable)
        .exec((err, result) => {
            if(err) return res.json({ success: false, deleteError: err })
            res.status(200).json({ success: true, deleteError: false })
        })
    
})



module.exports = router;
