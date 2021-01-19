import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useSelector } from 'react-redux';
import { Comment, Avatar, Modal, Button, Input, Rate, Dropdown, Menu, Row, Col } from 'antd';
import ProductLikeDislike from './ProductLikeDislike';
import timeForToday from './../../../utils/TimeForToday';


const { TextArea } = Input;

function ProductComment(props) {
    
    const productId = props.productId;

    const user = useSelector(state => state.user)
    const [commentValue, setCommentValue] = useState("")
    const [OpenButton, setOpenButton] = useState(false)
    //리뷰 임시저장
    const [SaveReview, setSaveReview] = useState([])
    //모달 상태
    const [isModalVisible, setIsModalVisible] = useState(false);
    //별점
    const [Rating, setRating] = useState(0)
    //수정 상태
    const [ReplyStatus, setReplyStatus] = useState(null)
    //수정할 리뷰 저장
    const [SaveReply, setSaveReply] = useState("")
    //수정할 내용 저장
    const [SaveContent, setSaveContent] = useState("")
    //별점 수정
    const [RatingModify, setRatingModify] = useState(0)

    const onChangeHandler = (e) => {
        setCommentValue(e.target.value)
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();

        let variable = {
            writer: user.userData._id,
            productId: productId,
            content: commentValue,
            rating: Rating === 0 ? 1 : Rating,
        };

        //댓글 정보 백엔드로 전달
        Axios.post('/api/productComment/saveComment', variable)
            .then(result => {
                if(result.data.success) {
                    setCommentValue("")
                    setOpenButton(false)
                    setRating(0)
                    props.refreshFunction(result.data.productReview)
                } else {
                    alert("상품 리뷰 등록 실패");
                }
            })
    }

    //textarea클릭
    const onClickHandler = () => {
        setOpenButton(true)
    }

    //삭제 버튼
    const deleteReviewHandler = (review) => {        
        console.log(review);
        setReplyStatus('delete')
        setIsModalVisible(true);
        setSaveReview(review)
        
    }

    //수정 버튼
    const modifyReviewHandler = (review) => {
        console.log(review);
        setReplyStatus('modify')
        setIsModalVisible(true)
        setSaveReply(review)
        setSaveContent(review.content)
        setRatingModify(review.rating)
    }

    //댓글 textarea수정 핸들링
    const modifyChangeHandler = (e) => {
        setSaveContent(e.target.value);
    }

    //모달 OK
    const handleOk = () => {
        console.log(SaveContent);
        setIsModalVisible(false);

        let variable = {};

        //만약 수정 상태라면
        if(ReplyStatus === 'modify') {
            variable = {
                _id: SaveReply._id,
                content: SaveContent,
                rating: RatingModify,
                modify: true
            }

            //백엔드로 전송
            Axios.post('/api/productComment/modifyComment', variable)
                .then(result => {
                    if(result.data.success) {
                        console.log('success?', result.data);
                        props.afterRefresh(result.data.review);
                    } else {
                        alert('수정 실패')
                    }
                })
        } else {
            //댓글의 고유 id를 전달한다.
            variable = {_id: SaveReview._id }
            
            //댓글을 지운다.
            Axios.post('/api/productComment/deleteComment', variable)
                .then(result => {
                    if(result.data.success) {
                        console.log(result.data);
                        props.afterRefresh(result.data.allReview)
                    } else {
                        alert('리뷰 삭제 실패');
                    }
                }) 
        }
        
    };

    //모달 취소
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    //별정 핸들링
    const rateHandler = (e) => {
        console.log(e);
        setRating(e)
    }

    //별점 수정 핸들링
    const rateModifyHandler = (e) => {
        console.log(e);
        setRatingModify(e);
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

    const menu = (
        <Menu>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" onClick={props.newDateFilters}>
                    최신 리뷰 순
                </a>
            </Menu.Item>
        </Menu>
    )

    return (
        <div>
            <br />
            <div style={{ display: 'flex'}}>
                <p> {props.productReviewNumber} 개의 상품리뷰가 있습니다. </p>
                <Dropdown overlay={menu} placement="bottomLeft" arrow>
                    <Button style={{ marginLeft: '24px'}}>정렬 기준</Button>
                </Dropdown>
            </div>
            <hr />

            {/* 리뷰입력 */}
            {localStorage.getItem('userId') ?
            <div>
            <Rate onChange={rateHandler} value={Rating}  />
            <form style={{ display: 'flex' }} onSubmit={onSubmitHandler}>
                
                <TextArea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={onChangeHandler}
                    value={commentValue}
                    onClick={onClickHandler}
                    placeholder="공개 댓글 추가"
                />
                <br />
                {OpenButton &&
                <Button style={{ width: '20%', height: '52px' }} onClick={onSubmitHandler}>리뷰</Button>
                }
                
            </form>
            </div>
            :
            <a href="/login">로그인하여 상품리뷰를 남겨보세요!</a>
            }
            
            
            {/* 리뷰목록 */}
            {props.reviewLists && props.reviewLists.map((review, index) => (
            <React.Fragment key={index}>
                <Comment
                    actions={
                        localStorage.getItem('userId') === review.writer._id &&
                        [
                            <div>
                                <span onClick={() => modifyReviewHandler(review)} key="comment-basic-modify-to">수정</span> &nbsp;
                                <span onClick={() => deleteReviewHandler(review)} key="comment-basic-delete-to">삭제</span> &nbsp;
                            </div>
                        ]
                    }
                    key={index}
                    author={review.writer.name}
                    avatar={<Avatar src={review.writer.image} alt={review.writer.name} />}
                    content={<ul style={{ listStyle: 'none' }}>
                        <li><h3>평점 : </h3><Rate value={review.rating} disabled={true}/></li><br />
                        <li><h3>리뷰 : </h3><pre>{review.content}</pre></li>
                        <li><ProductLikeDislike productCommentId={review && review._id} /></li>
                    </ul>}
                    datetime={review.modify ? timeForToday(review.updatedAt)+`(수정됨)` : timeForToday(review.createdAt)}
                    
                />
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
                    <Rate value={RatingModify} onChange={rateModifyHandler}/> <br />
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
            </React.Fragment>
            ))}
            
            
            
        </div>
    )
}

export default ProductComment
