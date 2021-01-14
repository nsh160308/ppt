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

    console.log(req.body);

    ProductComment.find({ productId: req.body.productId })
        .populate('writer')
        .exec((err, reviews) => {
            if(err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, allReview: reviews })  
        })

    
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




module.exports = router;
