const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = mongoose.Schema({
    //누가 좋아요를 눌렀는지
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    //상품 좋아요
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    //상품 리뷰 좋아요
    productCommentId: {
        type: Schema.Types.ObjectId,
        ref: 'ProductComment'
    },
    //영상 좋아요
    videoId: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    //영상 리뷰 좋아요
    videoCommentId: {
        type: Schema.Types.ObjectId,
        ref: 'VideoComment'
    },
}, { timestamps: true })


const Like = mongoose.model('Like', likeSchema);

module.exports = { Like }