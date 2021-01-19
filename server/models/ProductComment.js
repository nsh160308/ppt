const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productCommentSchema = mongoose.Schema({
    //댓글 작성자(writer)
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    //어디에다 작성하는지(productId)
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    //대댓글(response To)
    responseTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    //내용(content)
    content: {
        type: String,
    },
    //평점
    rating: {
        type: Number,
        default: 5
    },
    //수정 상태(modify)
    modify: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


const ProductComment = mongoose.model('ProductComment', productCommentSchema);

module.exports = { ProductComment }