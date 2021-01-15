import React, { useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import LikeDislikes from './LikeDislikes';


function SingleComment(props) {

    //console.log('코멘트', props.comment);

    const user = useSelector(state => state.user)

    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState("")

    const replyOpenHandler = () => {
        if(OpenReply) {
            console.log('댓글달기 창 OFF')
        } else {
            console.log('댓글닫기 ON')
        }
        setOpenReply(!OpenReply);
    }
    

    const commentValueHandler = (e) => {
        
        setCommentValue(e.target.value);
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();

        const variables = {
            writer: user.userData._id,
            videoId: props.videoId,
            //responseTo정보를 알려면 모든 comment정보를 DB에서 가져와야된다.
            //이 것은 가장 최상위인 DetailVideoPage에서 가져와야 된다.
            responseTo: props.comment._id,
            content: CommentValue
        }

        console.log(variables);

        Axios.post('/api/videoComment/saveComment', variables)
            .then(result => {
                if(result.data.success) {
                    console.log(result.data);
                    setCommentValue("")
                    setOpenReply(false)
                    props.refreshFunction(result.data.comment)

                } else {
                    alert("대댓글 실패");
                }
            })
    }

    const actions = [
        <LikeDislikes videoCommentId={props.comment._id}/>
        ,<span onClick={replyOpenHandler} key="comment-basic-reply-to">답글</span>
    ]

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt={props.comment.writer.name} />}
                content={<p>{props.comment.content}</p>}
            />

            {OpenReply &&
            <form style={{ display: 'flex' }} onSubmit={onSubmitHandler}>
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={commentValueHandler}
                    value={CommentValue}
                    placeholder="공개 댓글 추가"
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmitHandler}>댓글</button>
            </form>
            }
            

        </div>
    )
}

export default SingleComment
