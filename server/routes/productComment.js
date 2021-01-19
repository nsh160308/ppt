const { allLimit } = require('async');
const express = require('express');
const router = express.Router();
const { ProductComment } = require("../models/ProductComment");


//=================================
//           상품 리뷰
//=================================

router.post('/saveComment', (req, res) => {
    console.log(req.body);

    const newProductComment = new ProductComment(req.body);

    newProductComment.save((err, comment) => {
        if(err) return res.status(400).json({ success: false, err })
        
        ProductComment.find({ _id: comment._id })
            .populate('writer')
            .exec((err, review) => {
                if(err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, productReview: review })                
            })
    })
})

//모든 댓글 정보 가져오기
router.post('/getComments', (req, res) => {
    console.log('클라이언트가 준 정보', req.body);

    let skip = req.body.skip ? parseInt(req.body.skip) : 0
    let limit = req.body.limit ? parseInt(req.body.limit) : allLimit

    //모든 리뷰 가져오기
    if(req.body.pageStatus === 'default') {
        ProductComment.find({ productId: req.body.productId })
        .populate('writer')
        .exec((err, reviews) => {
            if(err) res.send(err)
            res.status(200)
            .json({
                success: true,
                reviews: reviews,
                postSize: reviews.length,
                pageStatus: 'default'
            })
        })
    }
    //리뷰 10개씩 가져오기
    else if(req.body.pageStatus === 'limited') {
        ProductComment.find({ productId: req.body.productId })
        .populate('writer')
        .skip(skip)
        .limit(limit)
        .exec((err, reviews) => {
            if(err) res.send(err)
            res.status(200)
            .json({
                success: true,
                reviews: reviews,
                postSize: reviews.length,
                pageStatus: 'limited'
            })
        })
    }
    //최신 리뷰 순으로 정렬
    else if(req.body.pageStatus === 'Sort by latest') {
        console.log('최신 리뷰 순으로 정렬합니다.');
        ProductComment.find({ productId: req.body.productId })
        .populate('writer')
        .sort([['updatedAt', 'desc']])
        .skip(skip)
        .limit(limit)
        .exec((err, reviews) => {
            if(err) res.send(err);
            res.status(200)
            .json({
                success: true,
                reviews: reviews,
                postSize: reviews.length,
                pageStatus: 'Sort by latest'
            })
        })
    }
    //더 보기
    if(req.body.loadMore === 'default') {
        console.log('더 보기')
        ProductComment.find({ productId: req.body.productId })
        .populate('writer')
        .skip(skip)
        .limit(limit)
        .exec((err, reviews) => {
            if(err) res.send(err)
            res.status(200)
            .json({
                success: true,
                reviews: reviews,
                postSize: reviews.length,
                loadMorePage: 'default'
            })
        })
    } else if(req.body.loadMore === 'Sort by latest') {
        console.log('최신 정렬 더 보기')
        ProductComment.find({ productId: req.body.productId })
        .populate('writer')
        .skip(skip)
        .limit(limit)
        .exec((err, reviews) => {
            if(err) res.send(err)
            res.status(200)
            .json({
                success: true,
                reviews: reviews,
                postSize: reviews.length,
                loadMorePage: 'Sort by latest'
            })
        })
    }
})

//선택한 댓글 삭제하기
router.post('/deleteComment', (req, res) => {

    console.log(req.body);

    ProductComment.findOneAndDelete({ _id: req.body._id },
        (err,doc) => {
            if(err) return res.status(400).json({ success: false, err })
            
            ProductComment.find()
                .populate('writer')
                .exec((err, reviews) => {
                    if(err) return res.status(400).json({ success: false, err })
                    res.status(200).json({ success: true, allReview: reviews})
                })
        })
        
    
})

//선택한 댓글 수정하기
router.post('/modifyComment', (req, res) => {
    console.log('클라이언트가 준 정보',req.body);
    
    ProductComment.findOneAndUpdate(
        { _id: req.body._id }, 
        { $set: { content: req.body.content, modify: req.body.modify, rating: req.body.rating } },
        { new: true },
        (err, result) => {
        if(err) return res.status(400).json({ success: false, err })
        })
        .populate('writer')
        .exec((err, review) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, review })
        })
})




module.exports = router;
