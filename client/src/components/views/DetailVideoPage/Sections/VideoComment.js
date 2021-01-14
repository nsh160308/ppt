import React, { useState } from 'react'
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function VideoComment(props) {

    console.log(props.commentLists);

    let videoId = props.videoId;

    const user = useSelector(state => state.user)

    const [commentValue, setcommentValue] = useState("")
    
    const textAreaHandler = (e) => {
        setcommentValue(e.target.value);
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();

        let variables = {
            //작성자
            writer: user.userData._id,
            //비디오id
            videoId: videoId,
            //댓글내용
            content: commentValue
        }

        Axios.post('/api/videoComment/saveComment', variables)
            .then(result => {
                if(result.data.success) {
                    console.log(result.data)
                    setcommentValue("")
                    props.refreshFunction(result.data.comment)
                } else {
                    alert("댓글 등록 실패");
                }
            })
    }

    return (
        <div>
            <br />
            <p> {props.commentLists.length}개의 댓글 </p>
            <hr />

            {/* 댓글입력 */}
            <form style={{ display: 'flex' }} onSubmit={onSubmitHandler}>
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={textAreaHandler}
                    value={commentValue}
                    placeholder="공개 댓글 추가"
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmitHandler}>댓글</button>
            </form>

            {/* 댓글목록 */}
            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo &&
                <React.Fragment key={index}>
                    <SingleComment refreshFunction={props.refreshFunction} comment={comment} videoId={videoId}/>
                    <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} videoId={videoId} commentLists={props.commentLists}/>
                </React.Fragment>
                )
                
            ))}

        </div>
    )
}

export default VideoComment
