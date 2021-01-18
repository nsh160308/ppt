import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';

function LikeDislikes(props) {

    //좋아요 관리
    const [Likes, setLikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)

    //싫어요 관리
    const [DisLikes, setDisLikes] = useState(0)
    const [DisLikeAction, setDisLikeAction] = useState(null)

    let variable = {}

    //비디오와 댓글의 좋아요 수를 가져오는 것을 분리하기 위해
    //DetailVideoPage에서 해당 컴포넌트한테 video라는 prop을 줌
    if(props.video) {
        variable = { 
            //누가 좋아요 눌렀는지
            userId: localStorage.getItem('userId'),
            //영상 좋아요
            videoId: props.videoId
        }
    //video가 없으면 이는 댓글 좋아요 수를 가지고 오는 것
    } else {
        variable = {
            //누가 좋아요 눌렀는지
            userId: localStorage.getItem('userId'),
            //댓글 좋아요
            videoCommentId: props.videoCommentId,
        }
    }

    
    useEffect(() => {
        //좋아요 가져오기
        Axios.post('/api/videoLD/getLikes', variable)
            .then(result => {
                // console.log(result.data)
                if(result.data.success) {
                    //console.log('성공적으로 좋아요 가져오는지', result.data);
                    //얼마나 많은 좋아요를 받았는지
                    setLikes(result.data.likes.length)
                    //내가 이미 좋아요를 눌렀는지
                    result.data.likes.map(like => {
                        if(like.userId === localStorage.getItem('userId')) {
                            setLikeAction('liked')
                        }
                    })
                } else {
                    alert("좋아요 가져오기 실패!");
                }
            })
        //싫어요 가져오기
        Axios.post('/api/videoLD/getDislikes', variable)
        .then(result => {
            if(result.data.success) {
                // console.log(result.data)
                //얼마나 많은 싫어요를 받았는지
                setDisLikes(result.data.dislikes.length)
                //내가 이미 싫어요 눌렀는지
                result.data.dislikes.map(dislike => {
                    if(dislike.userId === localStorage.getItem('userId')) {
                        setDisLikeAction('disliked')
                    }
                })
            } else {
                alert("싫어요 가져오기 실패!");
            }
        })

    }, [])

    //좋아요 클릭 핸들링
    const onLikeHandler = () => {

        //좋아요 클릭하지 않은 상태일 때 좋아요 1증가 시킨다.
        if(LikeAction === null) {
            Axios.post('/api/videoLD/upLike', variable)
                .then(result => {
                    if(result.data.success) {
                        // console.log(result.data)
                        //uplike에 성공했다면 좋아요 1올려야됨
                        setLikes(Likes + 1)
                        setLikeAction('liked')

                        if(DisLikeAction !== null) {
                            setDisLikeAction(null)
                            setDisLikes(DisLikes -1)
                        }
                    } else {
                        alert("좋아요 올리기 실패")
                    }
                })
        }
        //좋아요를 클릭한 상태일 때, 좋아요 1감소 시킨다.
        else {
            Axios.post('/api/videoLD/downLike', variable)
                .then(result => {
                    if(result.data.success) {
                        // console.log(result.data)
                        //downLike에 성공했다면 좋아요 1내림
                        setLikes(Likes -1)
                        setLikeAction(null)
                    } else {
                        alert('좋아요 내리기 실패')
                    }
                })
        }
    }

    //싫어요 버튼 핸들링
    const onDisLikeHandler = () => {

        //싫어요 버튼 눌렀는데 이미 클릭된 상태일 때,
        if(DisLikeAction !== null) {
            Axios.post('/api/videoLD/downDislike', variable)
                .then(result => {
                    if(result.data.success) {
                        // console.log(result.data)
                        setDisLikes(DisLikes - 1)
                        setDisLikeAction(null)
                    } else {
                        alert('싫어요 내리기 실패')
                    }
                })
        }
        //싫어요 눌렀는데 클릭되지 않았을 때,
        else {
            Axios.post('/api/videoLD/upDislike', variable)
                .then(result => {
                    if(result.data.success) {
                        // console.log(result.data)
                        setDisLikes(DisLikes + 1)
                        setDisLikeAction('disliked')

                        if(LikeAction !== null) {
                            setLikeAction(null)
                            setLikes(Likes - 1)
                        }
                    } else {
                        alert('싫어요 올리기 실패')
                    }
                })
        }
    }
    
    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="좋아요">
                    <Icon type="like"
                        theme={LikeAction === 'liked' ? "filled" : 'outlined'}
                        onClick={onLikeHandler}
                    />
                </Tooltip>
            <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Likes} </span>
            </span>&nbsp;&nbsp;

            <span key="comment-basic-dislike">
                <Tooltip title="싫어요">
                    <Icon type="dislike"
                        theme={DisLikeAction === 'disliked' ? "filled" : 'outlined'}
                        onClick={onDisLikeHandler}
                    />
                </Tooltip>
            <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {DisLikes} </span>
            </span>&nbsp;&nbsp;
        </div>
    )
}

export default LikeDislikes
