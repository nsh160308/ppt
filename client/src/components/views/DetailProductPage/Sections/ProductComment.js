import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useSelector } from 'react-redux';
import { Comment, Avatar, Modal } from 'antd';

function ProductComment(props) {

    
    const productId = props.productId;

    const user = useSelector(state => state.user)
    const [commentValue, setCommentValue] = useState("")
    const [OpenButton, setOpenButton] = useState(false)

    //리뷰 임시저장
    const [SaveReview, setSaveReview] = useState([])

    //모달
    const [isModalVisible, setIsModalVisible] = useState(false);

    const onChangeHandler = (e) => {
        setCommentValue(e.target.value)
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();

        let variable = {
            writer: user.userData._id,
            productId: productId,
            content: commentValue
        }

        //댓글 정보 백엔드로 전달
        Axios.post('/api/productComment/saveComment', variable)
            .then(result => {
                if(result.data.success) {
                    console.log(result.data);
                    setCommentValue("")
                    setOpenButton(false)
                    props.refreshFunction(result.data.productReview)
                } else {
                    alert("상품 리뷰 등록 실패");
                }
            })
    }

    //textarea클릭
    const onClickHandler = () => {
        setOpenButton(!OpenButton)
    }

    //삭제 버튼
    const deleteReviewHandler = (review) => {        
        console.log(review);
        setIsModalVisible(true);
        setSaveReview(review)
        
    }

    //모달 OK
    const handleOk = () => {
        console.log(SaveReview);
        setIsModalVisible(false);

        //댓글의 고유 id를 전달한다.
        let variable = {_id: SaveReview._id }
        
        //댓글을 지운다.
        Axios.post('/api/productComment/deleteComment', variable)
            .then(result => {
                if(result.data.success) {
                    console.log(result.data);
                    props.afterDeleteRefresh(result.data.allReview)
                } else {
                    alert('리뷰 삭제 실패');
                }
            }) 
    };

    //모달 취소
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <br />
            <p> {props.reviewLists.length} 개의 상품리뷰가 있습니다. </p>
            <hr />

            {/* 리뷰입력 */}
            {localStorage.getItem('userId') &&
            <form style={{ display: 'flex' }} onSubmit={onSubmitHandler}>
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={onChangeHandler}
                    value={commentValue}
                    onClick={onClickHandler}
                    placeholder="공개 댓글 추가"
                />
                <br />
                {OpenButton &&
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmitHandler}>리뷰</button>
                }
            </form>
            }
            

            {/* 리뷰목록 */}
            {props.reviewLists && props.reviewLists.map((review, index) => (
            <React.Fragment key={index}>
                <Comment
                actions={
                    localStorage.getItem('userId') === review.writer._id &&
                    [<span onClick={() => deleteReviewHandler(review)}>삭제</span>]}
                    key={index}
                    author={review.writer.name}
                    avatar={<Avatar src={review.writer.image} alt={review.writer.name} />}
                    content={<p>{review.content}</p>}
                />
                <Modal title="정말 삭제하시겠습니까?" 
                visible={isModalVisible} 
                onOk={handleOk} 
                onCancel={handleCancel}
                okText={"삭제"}
                cancelText={"취소"}>
                    <p>상품 리뷰를 삭제하시겠습니까?</p>
                </Modal>
            </React.Fragment>
            ))}
        </div>
    )
}

export default ProductComment
