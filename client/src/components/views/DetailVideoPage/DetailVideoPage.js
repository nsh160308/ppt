import React, { useEffect, useState } from 'react'
import { Row, Col, List, Avatar, Button } from 'antd'
import Axios from 'axios'
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import VideoComment from './Sections/VideoComment';
import LikeDislikes from './Sections/LikeDislikes';
import { useSelector } from 'react-redux';


function DetailVideoPage(props) {

    //redux stor에서 user가져오기
    const user = useSelector(state => state.user)
    //user의 userData가 있으면 isAuth상태 가져오기(로그인)
    const isAuth = user.userData && user.userData.isAuth;
    //videoId 가져오기
    const videoId = props.match.params.videoId
    //백엔드 전송시 보내주는 body객체
    const variable ={ videoId: videoId }

    //비디오 상세 정보 관리
    const [VideoDetail, setVideoDetail] = useState([])
    //모든 댓글 정보
    const [Comments, setComments] = useState([])

    useEffect(() => {
        
        

        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data);
                    setVideoDetail(response.data.videoDetail);
                } else {
                    alert('비디오 정보 가져오기 실패')
                }
            })

        //모든 댓글 정보 가져오기
        Axios.post('/api/videoComment/getComments', variable)
            .then(result => {
                if(result.data.success) {
                    console.log(result.data);
                    setComments(result.data.comments);
                } else {
                    alert("모든 댓글 정보 가져오기 실패");
                }
            })

    }, [])

    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment));
    }

    if(VideoDetail.writer) {

        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id}/>
        return (
            <Row gutter={[16,16]}>
                <Col lg={18} xs={24}>
    
                <div style={{ width: '100%', padding:'3rem 4rem' }}>
                    <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls  />
    
                    <List.Item
                        actions={[ <LikeDislikes video videoId={videoId} />, subscribeButton]}
                    >
                        
                        <List.Item.Meta
                            avatar={<Avatar src={VideoDetail.writer.image} />}
                            title={VideoDetail.writer.name}
                            description={VideoDetail.description}
                        />
                    </List.Item>
                    
                    {/* Comments */}
                    <VideoComment 
                        refreshFunction={refreshFunction} 
                        videoId={videoId} 
                        commentLists={Comments}
                        isAuth={isAuth} 
                        history={props.history}/>

    
                </div>
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
            </Row>
        )
    } else {
        return (
            <div>...로딩중입니다.</div>
        )
    }
    
}

export default DetailVideoPage
