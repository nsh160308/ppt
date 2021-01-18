const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoCommentSchema = mongoose.Schema({
    //댓글 작성자(writer)
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    //어디에다 작성하는지(videoId)
    videoId: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
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
    //수정 상태(modify)
    modify: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


const VideoComment = mongoose.model('VideoComment', videoCommentSchema);

module.exports = { VideoComment }