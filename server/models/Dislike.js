const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const disLikeSchema = mongoose.Schema({
    //누가 싫어요 눌렀는지
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    //상품 싫어요
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    //상품 리뷰 싫어요
    productCommentId: {
        type: Schema.Types.ObjectId,
        ref: 'ProductComment'
    },
    //영상 싫어요
    videoId: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    //영상 리뷰 싫어요
    videoCommentId: {
        type: Schema.Types.ObjectId,
        ref: 'VideoComment'
    }
}, { timestamps: true })


const Dislike = mongoose.model('Dislike', disLikeSchema);

module.exports = { Dislike }