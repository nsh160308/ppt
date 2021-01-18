import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment';

function ReplyComment(props) {
    
    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComment] = useState(false)

    useEffect(() => {
        let commentNumber = 0;

        props.commentLists.map((comment, index) => {
            if(comment.responseTo === props.parentCommentId) {
                commentNumber ++
            }
        })

        setChildCommentNumber(commentNumber);
        

    }, [props.commentLists])


    const renderReplyComment = (parentCommentId) => {

        return props.commentLists.map((comment, index) => (
            <React.Fragment key={index}>
                {
                    comment.responseTo === parentCommentId && 
                    <div style={{ width:'80%', marginLeft:'20px'}}>
                        <SingleComment 
                            refreshFunction={props.refreshFunction} 
                            comment={comment} 
                            videoId={props.videoId} 
                            afterRefresh={props.afterRefresh} />
                        <ReplyComment 
                            refreshFunction={props.refreshFunction} 
                            commentLists={props.commentLists} 
                            videoId={props.videoId} 
                            parentCommentId={comment._id}
                            afterRefresh={props.afterRefresh}/>
                    </div>
                }     
            </React.Fragment>
        ))
    }

    const onClickHandler = () => {
        console.log('click');
        setOpenReplyComment(!OpenReplyComments);
    }
    
    return (
        <div>
            {ChildCommentNumber > 0 && 
                <p style={{ fontSize: '14px', margin: 0, color: 'gray' }} onClick={onClickHandler}>
                {ChildCommentNumber}개의 댓글 더보기
                </p>
            }
            
            

            {/* 대댓글이 많을 수 있으니까 변수로 만듦 */}
            {OpenReplyComments &&
            renderReplyComment(props.parentCommentId)
            }
        </div>
    )
}

export default ReplyComment
