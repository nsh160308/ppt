import React, { useEffect, useState } from 'react'
import { Card, Icon, Avatar, Col, Typography, Row } from 'antd'
import Axios from 'axios';
//날짜 구문 분석, 유효성 검사, 조작 및 형식 지정을 위한 
//JavaScript 날짜 라이브러리입니다.
import moment from 'moment'

const { Title } = Typography
const { Meta } = Card

function LandingPage() {

    const [VideoInfo, setVideoInfo] = useState([])

    useEffect(() => {
        
        Axios.get('/api/video/getVideos')
            .then(response => {
                if(response.data.success) {
                    console.log(response.data);
                    setVideoInfo(response.data.videoInfo)
                } else {
                    alert('비디오 정보 가져오기 실패')
                }
            })

    }, [])

    const renderCards = VideoInfo.map((video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60)


        return <Col key={index} lg={6} md={8} xs={24}>
            <a href={`/video/${video._id}`}>
                <div style={{ position: 'relative' }}>
                    <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt='thumbnail'/>
                    <div className="duration">
                        <span>{minutes} : {seconds} </span>
                    </div>
                </div>
            </a>
            <br />
            <Meta
                avatar={
                    <Avatar src={video.writer.image} />
                }
                title={video.title}
                description=""
            />
            <span>{video.writer.name}</span> <br />
            <span style={{ marginLeft: '3rem' }}>{video.views} 회</span> - 
            <span>{moment(video.createdAt).format("MMM Do Year")}</span>
        </Col>


    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2}> MyTube </Title>
            <hr />
            <Row gutter={[32, 16]}>
                {renderCards}
            </Row>
        </div>
    )
}

export default LandingPage
