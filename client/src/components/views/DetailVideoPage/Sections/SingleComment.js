import React, { useState } from 'react'
import { Comment, Avatar, Button, Input, Modal } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import LikeDislikes from './LikeDislikes';


function SingleComment(props) {

    console.log('props', props.comment);


    const user = useSelector(state => state.user)

    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState("")

    //모달 상태 관리
    const [isModalVisible, setIsModalVisible] = useState(false)
    //댓글 임시 저장
    const [SaveReply, setSaveReply] = useState("")
    //댓글 상태
    const [ReplyStatus, setReplyStatus] = useState(null)
    //댓글 내용 저장
    const [SaveContent, setSaveContent] = useState("")
    //댓글 수정 성공
    const [modifySuccess, setModifySuccess] = useState(false)

    //답글 달기 핸들링
    const replyOpenHandler = () => {
        if(OpenReply) {
            console.log('댓글달기 창 OFF')
        } else {
            console.log('댓글닫기 ON')
        }
        setOpenReply(!OpenReply);
    }
    
    //답글작성 onChange 핸들링
    const commentValueHandler = (e) => {
        
        setCommentValue(e.target.value);
    }

    //답글 전송 onSubmit 핸들링
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

        //답글 백엔드로 전송
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

    //댓글 삭제 handler
    const deleteHandler = (selectComment) => {
        console.log(selectComment);
        setReplyStatus('delete')

        setIsModalVisible(true)
        setSaveReply(selectComment)
    }

    //모달 확인 핸들링
    const handleOk = () => {
        setIsModalVisible(false)

        let variable = {};

        if(ReplyStatus === 'modify') {
            variable = {
                _id: SaveReply._id,
                content: SaveContent,
                modify: true
            }

            //백엔드로 전송
            Axios.post('/api/videoComment/modifyComment', variable)
            .then(result => {
                if(result.data.success) {
                    console.log('success?', result.data);
                    props.afterRefresh(result.data);
                } else {
                    alert('댓글 수정 실패');
                }
            })
        } else {
            variable = {
                _id: SaveReply._id
            }

            //백엔드로 전송
            Axios.post('/api/videoComment/deleteComment', variable)
            .then(result => {
                if(result.data.success) {
                    console.log('삭제 후 남은 댓글',result.data.comments)
                    props.afterRefresh(result.data.comments);
                } else {
                    alert('댓글 삭제 실패');
                }
            })
        }

        
    }

    //모달 취소 핸들링
    const handleCancel = () => {
        setIsModalVisible(false);
    }

    //댓글 수정 핸들링
    const modifyHandler = (selectComment) => {
        console.log(selectComment);
        setReplyStatus('modify')

        setIsModalVisible(true)
        setSaveReply(selectComment)
        setSaveContent(selectComment.content)
    }

    //댓글 textarea수정 핸들링
    const modifyChangeHandler = (e) => {
        setSaveContent(e.target.value);
    }

    //댓글 작성 시간
    const timeForToday = (value) => {
        const today = new Date();
        const timeValue = new Date(value);
        const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
        //초
        if (betweenTime < 1) {
            let result = "";
            if(today.getSeconds() < timeValue.getSeconds()) {
                let parentSeconds = today.getSeconds() + 60
                result = parentSeconds - timeValue.getSeconds()
                return `${result}초 전`
            } else {
                result = today.getSeconds() - timeValue.getSeconds()
                return `${result}초 전`
            }
        }
        //분
        if (betweenTime < 60) {
            return `${betweenTime}분전`;
        }
        //시
        const betweenTimeHour = Math.floor(betweenTime / 60);
        if (betweenTimeHour < 24) {
            return `${betweenTimeHour}시간전`;
        }
        //일
        const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
        if (betweenTimeDay < 365) {
            return `${betweenTimeDay}일전`;
        }

        return `${Math.floor(betweenTimeDay / 365)}년전`;
    }

    //모달 데이터
    let data = {}

    if(ReplyStatus === 'delete') {
        data = {
            title: '정말 삭제하시겠습니까?',
            okText: '삭제',
            cancelText: '취소',
            text: '영상 댓글을 삭제하시겠습니까?'
        }
    } else {
        data = {
            title: '정말 수정하시겠습니까?',
            okText: '수정',
            cancelText: '취소',
            text: '영상 댓글을 수정하시겠습니까?'
        }
    }

    const actions = [
        <LikeDislikes videoCommentId={props.comment._id}/>
        ,<span onClick={replyOpenHandler} key="comment-basic-reply-to">답글</span>
        ,localStorage.getItem('userId') === props.comment.writer._id &&
        <div>
            <span onClick={() => deleteHandler(props.comment)} key="comment-basic-delete-to">삭제</span> &nbsp;
            <span onClick={() => modifyHandler(props.comment)} key="comment-basic-modify-to">수정</span>
        </div>
    ]

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt={props.comment.writer.name} />}
                content={<p>{props.comment.content}</p>}
                datetime={props.comment.modify ? timeForToday(props.comment.updatedAt)+`(수정됨)` : timeForToday(props.comment.createdAt)}
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
            
            {/* 모달 */}
            {ReplyStatus === 'delete'?
            <Modal title={data.title}
                visible={isModalVisible} 
                onOk={handleOk} 
                onCancel={handleCancel}
                okText={data.okText}
                cancelText={data.cancelText}>
                <p>{data.text}</p>
            </Modal>
            :
            <Modal title={data.title}
                visible={isModalVisible} 
                onOk={handleOk} 
                onCancel={handleCancel}
                okText={data.okText}
                cancelText={data.cancelText}>
                <p>{data.text}</p>
                <form style={{ display: 'flex' }} onSubmit={handleOk}>
                    <textarea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={modifyChangeHandler}
                        value={SaveContent}
                    />
                    <br />
                </form>
            </Modal>
            }
            

        </div>
    )
}

export default SingleComment
