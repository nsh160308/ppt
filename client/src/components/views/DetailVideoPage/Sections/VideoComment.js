import React, { useState } from 'react'
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';
import { Modal, Button, Input, Icon, Dropdown, Menu } from 'antd';

const { TextArea } = Input;

function VideoComment(props) {

    let videoId = props.videoId;
    const user = useSelector(state => state.user)
    const [commentValue, setcommentValue] = useState("")
    
    const textAreaHandler = (e) => {
        setcommentValue(e.target.value);
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();

        //로그인 페이지로 이동
        if(!props.isAuth) {
            console.log("로그인 페이지로 이동")
            return props.history.push('/login');
        }

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

    const menu = (
        <Menu>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" onClick={props.polularFilters}>
                    인기 댓글 순
                </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" onClick={props.newDateFilters}>
                    최신 날짜 순
                </a>
            </Menu.Item>
        </Menu>
    )

    return (
        <div>
            <br />
            <div style={{ display: 'flex'}}>
                <p style={{ marginBottom: '20px'}}> {props.postSize}개의 댓글 </p> &nbsp;
                <Dropdown overlay={menu} placement="bottomLeft" arrow>
                    <Button style={{ marginLeft: '24px'}}>정렬 기준</Button>
                </Dropdown>
            </div>
            <hr />

            {/* 댓글입력 */}
            
            {props.isAuth ?
            <form style={{ display: 'flex' }} onSubmit={onSubmitHandler}>
                <TextArea
                    autoSize={true}
                    style={{ width: '100%', borderRadius: '5px'}}
                    onChange={textAreaHandler}
                    value={commentValue}
                    placeholder="공개 댓글 추가"
                />
                <br />
                <Button style={{ width: '20%', height: '32px' }} onClick={onSubmitHandler}>댓글</Button>
            </form>
            :
            <div style={{ display: 'flex' }}>
            <TextArea
                    disabled
                    autoSize={true}
                    style={{ width: '100%', borderRadius: '5px' }}
                    placeholder="로그인 해서 댓글 달기"
            />
            <br />
            <Button style={{ width: '20%', height: '32px' }} onClick={onSubmitHandler}>로그인</Button>
            </div>
            }

            {/* 댓글목록 */}
            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo &&
                <React.Fragment key={index}>
                    <SingleComment 
                        refreshFunction={props.refreshFunction} 
                        comment={comment} 
                        videoId={videoId} 
                        afterRefresh={props.afterRefresh}/>
                    <ReplyComment 
                        refreshFunction={props.refreshFunction} 
                        parentCommentId={comment._id} 
                        videoId={videoId} 
                        commentLists={props.commentLists}
                        afterRefresh={props.afterRefresh}/>
                </React.Fragment>
                )
            ))}
        </div>
    )
}

export default VideoComment
