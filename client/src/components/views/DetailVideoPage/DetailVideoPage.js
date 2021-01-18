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
    const variable ={ videoId: videoId, normal: true }

    //비디오 상세 정보 관리
    const [VideoDetail, setVideoDetail] = useState([])
    //모든 댓글 정보
    const [Comments, setComments] = useState([])
    //수정 상태 정보
    const [modifyStatus, setModifyStatus] = useState(false)

    //스킵
    const [Skip, setSkip] = useState(0)
    //리미트
    const [Limit, setLimit] = useState(10)
    //포스트 사이즈
    const [PostSize, setPostSize] = useState(0)
    //전체 댓글 저장
    const [AllPostSize, setAllPostSize] = useState(0)
    //더보기 버튼 상태
    const [loadMoreBtn, setLoadMoreBtn] = useState(null)
    //모든 댓글들의 _id 상태 관리
    const [CommentsId, setCommentsId] = useState([])

    useEffect(() => {

        //모든 비디오 정보 가져오기
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data);
                    setVideoDetail(response.data.videoDetail);
                } else {
                    alert('비디오 정보 가져오기 실패')
                }
            })
        
        // 모든 댓글 정보 가져오기
        Axios.post('/api/videoComment/getComments', variable)
            .then(result => {
                if(result.data.success) {
                    console.log('모든 댓글 가져오기',result.data);
                    setCommentsId(result.data.comments);
                    setAllPostSize(result.data.postSize)
                    //테스트
                    let body = {
                        skip: Skip,
                        limit: Limit,
                        videoId: videoId,
                        normal: true
                    }

                    getReplies(body)
                } else {
                    alert("모든 댓글 정보 가져오기 실패");
                }
            })
    }, [])

    //댓글 필터링
    const getReplies = (body) => {
        console.log('보내기전 body', body);
        Axios.post('/api/videoComment/getComments', body)
            .then(response => {
                if (response.data.success) {
                    console.log('댓글 가져오기',response.data);
                    if(body.loadMore) {
                        if(body.normal) {
                            setComments([...Comments, ...response.data.comments])
                            setLoadMoreBtn(response.data.status)
                        } else if(body.newDate) {
                            setComments([...Comments, ...response.data.comments])
                            setLoadMoreBtn(response.data.status)
                        } else if(body.popular) {
                            console.log(response.data)
                            // setComments([...Comments, ...response.data.comments])
                            // setLoadMoreBtn(response.data.status)
                        }
                    } else {
                        if(response.data.status === 'normal') {
                            console.log('댓글', response.data.comments);
                            setComments(response.data.comments)
                            setLoadMoreBtn(response.data.status)
                        } else if(response.data.status === 'newDate') {
                            setComments(response.data.comments)
                            setLoadMoreBtn(response.data.status)
                        } else if(response.data.status === 'popular') {
                            setComments(response.data.comments)
                            setLoadMoreBtn(response.data.status)
                        }
                    }
                    setPostSize(response.data.postSize)
                    
                } else {
                    alert("댓글 가져오는데 실패")
                }
            })
    }
    //더보기 클릭
    const loadMoreHanlder = () => {
        let body = {};
        let skip = Skip + Limit

        if(loadMoreBtn === 'normal') {
            body = {
                skip: skip,
                limit: Limit,
                videoId: videoId,
                normal: true,
                loadMore: true
            }
            getReplies(body)
            setSkip(skip)
        } else if(loadMoreBtn === 'newDate'){
            body = {
                skip: skip,
                limit: Limit,
                videoId: videoId,
                newDate: true,
                loadMore: true,
            }
            getReplies(body)
            setSkip(skip)
        }
    }

    //댓글 추가
    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment));
    }

    //댓글 수정 및 삭제
    const afterRefresh = (commentLists) => {
        let array = [];
        if(commentLists.status === 'modify') {
            Comments.map(comment => {
                
                if(comment._id === commentLists.comment._id) {
                    comment = commentLists.comment
                    array.push(comment)
                } else array.push(comment)

                return array
            })

            setComments(array)

        } else {
            setComments(commentLists);
        }
    }

    //인기 댓글 순
    const polularFilters = () => {
        
        // Axios.post('/api/videoLD/getLikes', body)
        //     .then(result => {
        //         if(result.data.success) {
                    
        //         } else {
        //             alert("좋아요 가져오기 실패");
        //         }
        //     })

    }

    //최근 날짜 순
    const newDateFilters = () => {
        
        let body = {
            skip: 0,
            limit: Limit,
            videoId: videoId,
            newDate: true
        }

        getReplies(body)
    }

    if(VideoDetail.writer) {
        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id}/>
        return (
            <Row gutter={[16,16]}>
                {/* 메인 영상 */}
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
                            history={props.history}
                            afterRefresh={afterRefresh}
                            postSize={AllPostSize}
                            polularFilters={polularFilters}
                            newDateFilters={newDateFilters}
                        />

                        {PostSize >= Limit &&
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button onClick={loadMoreHanlder}>더보기</button>
                            </div>
                        }
                    </div>
                </Col>
                {/* 사이드 영상 */}
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
